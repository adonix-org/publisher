import { AgentSource } from ".";
import { Lifecycle } from "../lifecycle";
import { ImageSource } from "../sources";
import { ErrorTask, ImageFrame, ImageTask } from "../tasks";

export abstract class Agent extends Lifecycle {
    private readonly imageTasks: ImageTask[] = [];
    private readonly errorTasks: ErrorTask[] = [];

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

        this.finished = this.run();
    }

    protected override async onstop(): Promise<void> {
        await super.onstop();
        await this.finished;
    }

    protected oncomplete(): Promise<void> {
        return Promise.resolve(); // default no-op
    }

    private async run(): Promise<void> {
        while (true) {
            try {
                const image = await this.source.next();
                if (!image) break;

                await this.onimage(image);
            } catch (err) {
                void this.onerror(this.source, err);
            }

            await new Promise((res) => setImmediate(res));
        }

        await this.oncomplete();
    }

    private async onimage(image: ImageFrame): Promise<void> {
        let current: ImageFrame | null = image;
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

        if (error.name === "AbortError") return;

        for (const task of this.errorTasks) {
            void task.handle({
                source: source.toString(),
                error,
                timestamp: Date.now(),
            });
        }
    }

    public override toString(): string {
        return `${super.toString()}[Agent]`;
    }
}
