import { ImageFrame, ImageTask } from "..";

export class Profiler implements ImageTask {
    constructor(private readonly task: ImageTask) {}

    public async process(
        frame: ImageFrame,
        signal: AbortSignal,
    ): Promise<ImageFrame | null> {
        const start = performance.now();
        const result = await this.task.process(frame, signal);
        const end = performance.now();

        if (result) {
            const before = frame.image.buffer.byteLength;
            const after = result.image.buffer.byteLength;
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
