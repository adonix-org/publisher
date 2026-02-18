import { ImageBuffer, ImageTask } from "../../agents/interfaces";

export class Profiler implements ImageTask {
    constructor(private readonly task: ImageTask) {}

    public async process(
        image: ImageBuffer,
        signal: AbortSignal,
    ): Promise<ImageBuffer | null> {
        const start = performance.now();
        const result = await this.task.process(image, signal);
        const end = performance.now();

        if (result) {
            const before = image.buffer.byteLength;
            const after = result.buffer.byteLength;
            const percentChange = ((after - before) / before) * 100;

            console.debug(
                this.task.toString(),
                "before:",
                before,
                "after:",
                after,
                `change: ${percentChange >= 0 ? "+" : ""}${percentChange.toFixed(2)}%`,
                "duration:",
                `${(end - start).toFixed(2)}ms`,
            );
        } else {
            console.debug(
                this.task.toString(),
                "returned null",
                "duration",
                `${(end - start).toFixed(2)}ms`,
            );
        }

        return result;
    }

    public toString(): string {
        return `[Profiler]${this.task.toString()}`;
    }
}
