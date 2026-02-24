import { ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { ImageSource } from ".";
import { Lifecycle } from "../lifecycle";
import { ImageFrame } from "../tasks";
import { FrameQueue } from "./queue";

export class Ffmpeg extends Lifecycle implements ImageSource {
    private static readonly JPEG_START = Buffer.from([0xff, 0xd8]);
    private static readonly JPEG_END = Buffer.from([0xff, 0xd9]);

    private process: ChildProcessWithoutNullStreams | null = null;

    constructor(
        private readonly args: string[],
        private readonly frames: FrameQueue = new FrameQueue(),
    ) {
        super(frames);
    }

    public async next(): Promise<ImageFrame | null> {
        return this.frames.next();
    }

    protected onimage(buffer: Buffer): ImageFrame {
        return {
            image: { buffer, contentType: "image/jpeg" },
            seek: Date.now() / 1000,
            version: 1,
            annotations: [],
        };
    }

    private chunks: Buffer[] = [];
    private totalLength = 0;
    private scanOffset = 0;

    protected ondata(chunk: Buffer): void {
        this.chunks.push(chunk);
        this.totalLength += chunk.length;

        let buffer = Buffer.concat(this.chunks, this.totalLength);
        let start = buffer.indexOf(Ffmpeg.JPEG_START, this.scanOffset);
        let end: number;

        while (
            start !== -1 &&
            (end = buffer.indexOf(Ffmpeg.JPEG_END, start + 2)) !== -1
        ) {
            const image = buffer.subarray(start, end + 2);
            this.frames.push(this.onimage(image));
            this.scanOffset = end + 2;
            start = buffer.indexOf(Ffmpeg.JPEG_START, this.scanOffset);
        }

        if (this.scanOffset > 0) {
            buffer = buffer.subarray(this.scanOffset);
            this.chunks = [buffer];
            this.totalLength = buffer.length;
            this.scanOffset = 0;
        }
    }

    public override async onstart(): Promise<void> {
        await super.onstart();

        this.frames.clear();

        this.process = spawn("/opt/homebrew/bin/ffmpeg", this.args);
        this.process.stdout.on("data", (chunk) => {
            this.ondata(chunk);
        });
        this.process.stderr.on("data", (chunk) => {
            console.error(chunk.toString());
        });
        this.process.once("exit", () => {
            this.process = null;
        });
    }

    public override async onstop(): Promise<void> {
        await super.onstop();

        await new Promise<void>((resolve) => {
            if (this.process === null || this.process.killed) {
                resolve();
                return;
            }

            const cleanup = () => resolve();
            this.process.once("exit", cleanup);
            this.process.once("error", cleanup);
            this.process.kill();
        });
    }

    public override toString(): string {
        return `[ffmpeg]`;
    }
}
