import { ImageBuffer, ImageTask } from "../../interfaces";

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
}

export class Total implements ImageTask {
    constructor(
        private readonly tasks: ImageTask[],
        private readonly name?: string,
    ) {}

    private colorizePercent(percent: number): string {
        if (percent > 0) return `\x1b[32m+${percent.toFixed(2)}%\x1b[0m`; // green
        if (percent < 0) return `\x1b[31m${percent.toFixed(2)}%\x1b[0m`; // red
        return `\x1b[37m0.00%\x1b[0m`; // white
    }

    public async process(
        image: ImageBuffer,
        signal: AbortSignal,
    ): Promise<ImageBuffer | null> {
        const totalStart = performance.now();
        let current = image;

        console.debug(`\n--- [${this.name ?? "ProfilerNode"}] Frame Start ---`);

        for (const task of this.tasks) {
            const start = performance.now();
            const result = await task.process(current, signal);
            const end = performance.now();

            if (result) {
                const before = current.buffer.byteLength;
                const after = result.buffer.byteLength;
                const percentChange = ((after - before) / before) * 100;

                console.debug(
                    `[${task.toString()}] before: ${before} | after: ${after} | ` +
                        `change: ${this.colorizePercent(percentChange)} | duration: ${(end - start).toFixed(2)}ms`,
                );
            } else {
                console.debug(
                    `[${task.toString()}] returned null | duration: ${(end - start).toFixed(2)}ms`,
                );
            }

            current = result ?? current;
        }

        const totalEnd = performance.now();
        console.debug(
            `[${this.name ?? "ProfilerNode"}] total pipeline duration: ${(totalEnd - totalStart).toFixed(2)}ms`,
        );
        console.debug(`--- [${this.name ?? "ProfilerNode"}] Frame End ---\n`);

        return current;
    }
}
