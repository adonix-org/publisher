import { Lifecycle } from "../lifecycle";

export interface ImageBuffer {
    contentType: string;
    buffer: Buffer;
}

export interface ImageSource {
    next(signal: AbortSignal): Promise<ImageBuffer | null>;
}

export interface ImageTask {
    process(image: ImageBuffer): Promise<ImageBuffer | null>;
}

export interface ImageError {
    error: Error;
    source: string;
    timestamp: number;
}

export interface ErrorTask {
    handle(error: ImageError): Promise<void>;
}

export abstract class TaskAgent extends Lifecycle {
    private readonly imageTasks: ImageTask[] = [];
    private readonly errorTasks: ErrorTask[] = [];

    private controller: AbortController | null = null;
    private loopPromise: Promise<void> | null = null;

    protected constructor(private readonly imageSource: ImageSource) {
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

        this.controller = new AbortController();
        this.loopPromise = this.loop(this.controller.signal);
    }

    public override async onstop(): Promise<void> {
        await super.onstop();

        this.controller?.abort();
        await this.loopPromise;
    }

    private async loop(signal: AbortSignal): Promise<void> {
        while (!signal.aborted) {
            const image = await this.get(signal);
            if (!image) continue;

            await this.onimage(image);
        }
    }

    private async get(signal: AbortSignal): Promise<ImageBuffer | null> {
        try {
            return await this.imageSource.next(signal);
        } catch (err) {
            void this.onerror(this.imageSource, err);
            return null;
        }
    }

    private async onimage(image: ImageBuffer): Promise<void> {
        let current: ImageBuffer | null = image;
        for (const task of this.imageTasks) {
            try {
                current = await task.process(current);
            } catch (err) {
                void this.onerror(task, err);
                return;
            }
            if (!current) return;
        }
    }

    private async onerror(
        source: ImageSource | ImageTask,
        err: unknown,
    ): Promise<void> {
        const error = err instanceof Error ? err : new Error(String(err));

        for (const task of this.errorTasks) {
            await task.handle({
                source: source.toString(),
                error,
                timestamp: Date.now(),
            });
        }
    }

    public override toString(): string {
        return "[TaskAgent]";
    }
}
