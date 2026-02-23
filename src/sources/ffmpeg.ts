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

    public override async onstart(): Promise<void> {
        await super.onstart();

        this.process = spawn("/opt/homebrew/bin/ffmpeg", this.args);

        this.process.stdout.on("data", (chunk) => {
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

                const jpeg = Buffer.from(this.buffer.subarray(start, end + 2));
                this.buffer = Buffer.from(this.buffer.subarray(end + 2));

                const frame: ImageFrame = {
                    image: { buffer: jpeg, contentType: "image/jpeg" },
                    seek: 0,
                    version: 1,
                    annotations: [],
                };

                console.info(this.toString(), frame.image.buffer.byteLength);
                this.frames.push(frame);
            }
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

    public async next(): Promise<ImageFrame | null> {
        if (this.process === null) {
            return null;
        }

        return this.frames.next();
    }

    public override toString(): string {
        return `[Ffmpeg]`;
    }
}
