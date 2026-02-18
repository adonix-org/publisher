export abstract class Lifecycle {
    private readonly children: Lifecycle[];
    private transition: Promise<void> | null = null;
    private _running = false;

    constructor(...children: Lifecycle[]) {
        this.children = children;
    }

    public get running(): boolean {
        return this._running;
    }

    public async start(): Promise<void> {
        return this.schedule(async () => {
            if (this.running) return;

            console.debug(this.toString(), "starting...");
            await this.onstart();
            this._running = true;
            console.debug(this.toString(), "started");
        });
    }

    public async stop(): Promise<void> {
        return this.schedule(async () => {
            if (!this.running) return;

            console.debug(this.toString(), "stopping...");
            await this.onstop();
            this._running = false;
            console.debug(this.toString(), "stopped");
        });
    }

    protected async onstart(): Promise<void> {
        await Promise.all(this.children.map((r) => r.start()));
    }

    protected async onstop(): Promise<void> {
        await Promise.all(this.children.map((r) => r.stop()));
    }

    protected callback<T extends unknown[]>(
        fn: ((...args: T) => void) | undefined,
        ...args: T
    ): void {
        if (!fn) return;
        setImmediate(() => fn(...args));
    }

    private schedule(fn: () => Promise<void>): Promise<void> {
        const run = async () => {
            await fn();
        };

        const promise = this.transition ? this.transition.then(run) : run();

        this.transition = promise.finally(() => {
            if (this.transition === promise) {
                this.transition = null;
            }
        });

        return this.transition;
    }

    public toString(): string {
        return "[Lifecycle]";
    }
}
