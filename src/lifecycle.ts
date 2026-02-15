export class Lifecycle {
    private transition: Promise<void> | null = null;
    private _running = false;

    public get running(): boolean {
        return this._running;
    }

    protected async onstart(): Promise<void> {}
    protected async onstop(): Promise<void> {}

    public async start(): Promise<void> {
        return this.schedule(async () => {
            if (this.running) return;

            console.info(this.toString(), "starting...");
            await this.onstart();
            this._running = true;
            console.info(this.toString(), "started");
        });
    }

    public async stop(): Promise<void> {
        return this.schedule(async () => {
            if (!this.running) return;

            console.info(this.toString(), "stopping...");
            await this.onstop();
            this._running = false;
            console.info(this.toString(), "stopped");
        });
    }

    private schedule(fn: () => Promise<void>): Promise<void> {
        const run = async () => {
            await fn();
        };

        const promise = this.transition
            ? this.transition.then(run, run)
            : run();

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
