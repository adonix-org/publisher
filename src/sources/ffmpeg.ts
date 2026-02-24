import { ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { ImageSource } from ".";
import { Lifecycle } from "../lifecycle";
import { ImageFrame } from "../tasks";
import { ImageStream } from "./streams/image";

export class Ffmpeg extends Lifecycle implements ImageSource {
    private process: ChildProcessWithoutNullStreams | null = null;

    constructor(
        private readonly args: string[],
        private readonly stream: ImageStream,
    ) {
        super(stream);
    }

    public async next(): Promise<ImageFrame | null> {
        return this.stream.next();
    }

    public override async onstart(): Promise<void> {
        await super.onstart();

        this.stream.clear();

        this.process = spawn("/opt/homebrew/bin/ffmpeg", this.args);
        this.process.stdout.on("data", (chunk) => {
            this.stream.ondata(chunk);
        });
        this.process.stderr.on("data", (chunk) => {
            console.error(chunk.toString());
        });
        this.process.once("exit", async () => {
            await this.stream.stop();

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
