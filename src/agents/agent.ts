import { Lifecycle } from "../lifecycle";
import { ErrorTask, ImageBuffer, ImageSource, ImageTask } from "./interfaces";

export abstract class Agent extends Lifecycle {
    private readonly imageTasks: ImageTask[] = [];
    private readonly errorTasks: ErrorTask[] = [];

    private shutdown: AbortController | null = null;
    private finished: Promise<void> | null = null;

    protected constructor(private readonly source: ImageSource) {
        super();
    }

    protected addErrorTask(task: ErrorTask) {
        this.errorTasks.push(task);
    }

    protected addImageTask(task: ImageTask) {
        this.imageTasks.push(task);
    }

    protected override async onstart(): Promise<void> {
        await super.onstart();

        this.shutdown = new AbortController();
        this.finished = this.run(this.shutdown.signal);
    }

    protected override async onstop(): Promise<void> {
        await super.onstop();

        this.shutdown?.abort();
        await this.finished;
    }

    private async run(signal: AbortSignal): Promise<void> {
        while (!signal.aborted) {
            const image = await this.next(signal);
            if (image) {
                void this.onimage(image, signal);
            }
            await new Promise((res) => setImmediate(res));
        }
    }

    private async next(signal: AbortSignal): Promise<ImageBuffer | null> {
        try {
            return await this.source.next(signal);
        } catch (err) {
            void this.onerror(this.source, err, signal);
            return null;
        }
    }

    private async onimage(
        image: ImageBuffer,
        signal: AbortSignal,
    ): Promise<void> {
        let current: ImageBuffer | null = image;
        for (const task of this.imageTasks) {
            try {
                current = await task.process(current, signal);
            } catch (err) {
                void this.onerror(task, err, signal);
                return;
            }
            if (!current) return;
        }
    }

    private async onerror(
        source: ImageSource | ImageTask,
        err: unknown,
        signal: AbortSignal,
    ): Promise<void> {
        const error = err instanceof Error ? err : new Error(String(err));

        if (error.name === "AbortError") return;

        for (const task of this.errorTasks) {
            void task.handle(
                {
                    source: source.toString(),
                    error,
                    timestamp: Date.now(),
                },
                signal,
            );
        }
    }

    public override toString(): string {
        return "[Agent]";
    }
}
