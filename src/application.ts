import { Lifecycle } from "./lifecycle";
import { abort } from "./constants";

class Application extends Lifecycle {
    constructor(...children: Lifecycle[]) {
        super(...children);

        process.on("SIGTERM", () => void this.stop());
        process.on("SIGINT", () => void this.stop());

        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
            process.stdin.resume();
            process.stdin.setEncoding("utf8");
            process.stdin.on("data", async (key) => {
                if (key.toString().toLowerCase() === "q") {
                    // q to exit
                    await this.stop();
                }
                if (key === "\u0003") {
                    // Ctrl+C to fast exit
                    await this.abort();
                }
                if (key.toString().toLowerCase() === "k") {
                    // k to fast exit
                    await this.abort();
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

    public override async stop(): Promise<void> {
        await super.stop();

        process.exit(0);
    }

    private async abort(): Promise<void> {
        abort();

        await this.stop();
    }

    public override toString(): string {
        return `${super.toString()}[Application]`;
    }
}

export const application = new Application();
