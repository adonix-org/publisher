import { ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { ImageSource } from ".";
import { Lifecycle } from "../lifecycle";
import { ImageFrame } from "../tasks";
import { FrameQueue } from "./queue";

export class Ffmpeg extends Lifecycle implements ImageSource {
    private process: ChildProcessWithoutNullStreams | null = null;
    private buffer = Buffer.alloc(0);

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

    protected ondata(chunk: Buffer): void {
        this.buffer = Buffer.concat([this.buffer, chunk]);

        while (true) {
            const start = this.buffer.indexOf(Buffer.from([0xff, 0xd8]));
            const end = this.buffer.indexOf(
                Buffer.from([0xff, 0xd9]),
                start + 2,
            );

            if (start === -1 || end === -1) {
                break;
            }

            const image = this.buffer.subarray(start, end + 2);
            this.buffer = this.buffer.subarray(end + 2);

            const frame = this.onimage(image);

            console.info(this.toString(), frame.image.buffer.byteLength);
            this.frames.push(frame);
        }
    }

    public override async onstart(): Promise<void> {
        await super.onstart();

        this.buffer = Buffer.alloc(0);
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
