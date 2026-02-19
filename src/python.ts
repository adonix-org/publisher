import { spawn, ChildProcess } from "node:child_process";
import { Lifecycle } from "./lifecycle";

export class Python extends Lifecycle {
    private process: ChildProcess | null = null;

    protected override async onstart(): Promise<void> {
        await super.onstart();

        this.process = spawn(
            "venv/bin/python",
            ["src/tasks/python/server.py"],
            {
                stdio: "inherit",
            },
        );

        this.process.once("exit", () => {
            this.process = null;
        });
    }

    protected override async onstop(): Promise<void> {
        await super.onstop();

        await new Promise<void>((resolve) => {
            if (this.process === null || this.process.killed) {
                resolve();
                return;
            }

            const cleanup = () => resolve();
            this.process.once("exit", cleanup);
            this.process.once("error", cleanup);

            this.process.kill("SIGINT");
        });
    }

    public override toString(): string {
        return `${super.toString()}[Python]`;
    }
}
