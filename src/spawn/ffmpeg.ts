import { ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { Lifecycle } from "../lifecycle";

export abstract class Ffmpeg extends Lifecycle {
    protected process: ChildProcessWithoutNullStreams | null = null;

    constructor(private readonly args: string[]) {
        super();
    }

    public override async onstart(): Promise<void> {
        await super.onstart();

        this.process = spawn("/opt/homebrew/bin/ffmpeg", this.args);

        this.process.stderr.on("data", (chunk) => {
            console.error(chunk.toString());
        });

        this.process.once("exit", async () => {
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
