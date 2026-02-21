import { spawn, ChildProcess } from "node:child_process";
import { Lifecycle } from "./lifecycle";

export class PyServer extends Lifecycle {
    private process: ChildProcess | null = null;

    protected override async onstart(): Promise<void> {
        await super.onstart();

        this.process = spawn(
            `${process.cwd()}/python/.venv/bin/python`,
            [`${process.cwd()}/python/app/pyserver.py`],
            {
                stdio: ["ignore", "pipe", "pipe"],
            },
        );

        this.process.once("exit", () => {
            this.process = null;
        });

        this.process.stdout?.on("data", (data) => {
            console.debug(data.toString());
        });

        await new Promise<void>((resolve, reject) => {
            if (this.process === null)
                return reject(new Error("Process failed to start"));

            this.process.stdout?.on("data", (data) => {
                const text = data.toString();
                if (text.includes("PyServer ready")) {
                    resolve();
                }
            });
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
        return `${super.toString()}[PyServer]`;
    }
}
