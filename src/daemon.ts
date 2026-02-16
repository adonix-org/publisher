import { Lifecycle } from "./lifecycle";

export class Daemon extends Lifecycle {
    private readonly runnable: Lifecycle[];

    constructor(...runnable: Lifecycle[]) {
        super();

        this.runnable = runnable;

        process.on("SIGTERM", () => void this.stop());
        process.on("SIGINT", () => void this.stop());

        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
            process.stdin.resume();
            process.stdin.setEncoding("utf8");
            process.stdin.on("data", async (key) => {
                if (key === "\u0003") {
                    // Ctrl+C to exit
                    await this.stop();
                }
                if (key.toString().toLowerCase() === "q") {
                    // q to exit
                    await this.stop();
                }
                if (key.toString().toLowerCase() === "c") {
                    // Press 'c' to clear
                    process.stdout.write("\x1Bc");
                }

                if (key === "\r") {
                    // Enter key → 5 blank lines
                    process.stdout.write("_".repeat(80));
                    process.stdout.write("\n".repeat(5));
                }
            });
        }
    }

    protected override async onstart(): Promise<void> {
        await super.onstart();

        await Promise.all(this.runnable.map((r) => r.start()));
    }

    protected override async onstop(): Promise<void> {
        await super.onstop();

        await Promise.all(this.runnable.map((r) => r.stop()));
    }

    public override async stop(): Promise<void> {
        await super.stop();

        process.exit(0);
    }

    public override toString(): string {
        return `${super.toString()}[Daemon]`;
    }
}
