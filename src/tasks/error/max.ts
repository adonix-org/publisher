import { ErrorTask, ImageError } from "..";

export class MaxErrors implements ErrorTask {
    private count = 0;

    constructor(private readonly max: number = 3) {}

    public async handle(_error: ImageError): Promise<void> {
        this.count++;

        if (this.count < this.max) {
            return;
        }

        console.error(
            this.toString(),
            `max errors (${this.max}) exceeded, shutting down...`,
        );
        process.kill(process.pid, "SIGTERM");
    }

    public toString(): string {
        return "[MaxErrors]";
    }
}
