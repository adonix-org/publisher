import path from "node:path";
import { spawn, ChildProcess } from "node:child_process";
import { Lifecycle } from "./lifecycle";

const pythonExe = path.resolve("venv", "bin", "python");

export class Python extends Lifecycle {
    private process: ChildProcess | null = null;

    protected override async onstart(): Promise<void> {
        await super.onstart();

        this.process = spawn(pythonExe, ["src/tasks/python/server.py"], {
            stdio: "inherit",
        });

        this.process.once("exit", () => {
            this.process = null;
        });
    }

    protected override async onstop(): Promise<void> {
        await super.onstop();

        if (this.process === null) {
            return;
        }

        await new Promise<void>((resolve) => {
            this.process?.once("exit", (code) => {
                console.debug(this.toString(), `exited with code ${code}`);
                resolve();
            });
            this.process!.kill("SIGINT");
        });
    }

    public override toString(): string {
        return `${super.toString()}[Python]`;
    }
}
