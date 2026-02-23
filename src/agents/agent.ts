import { AgentSource } from ".";
import { Lifecycle } from "../lifecycle";
import { ImageSource } from "../sources";
import { ErrorTask, ImageFrame, ImageTask } from "../tasks";

export abstract class Agent extends Lifecycle {
    private readonly imageTasks: ImageTask[] = [];
    private readonly errorTasks: ErrorTask[] = [];

    private shutdown: AbortController | null = null;
    private finished: Promise<void> | null = null;

    protected constructor(
        private readonly source: AgentSource,
        ...children: Lifecycle[]
    ) {
        super(source, ...children);
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

    protected async oncomplete(): Promise<void> {}

    private async run(signal: AbortSignal): Promise<void> {
        while (!signal.aborted) {
            try {
                const image = await this.source.next(signal);
                if (!image) {
                    break;
                }

                await this.onimage(image, signal);
            } catch (err) {
                void this.onerror(this.source, err, signal);
            }

            await new Promise((res) => setImmediate(res));
        }

        if (!signal.aborted) {
            await this.oncomplete();
        }
    }

    private async onimage(
        image: ImageFrame,
        signal: AbortSignal,
    ): Promise<void> {
        let current: ImageFrame | null = image;
        for (const task of this.imageTasks) {
            if (signal.aborted) return;
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
        return `${super.toString()}[Agent]`;
    }
}
