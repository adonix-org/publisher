import { Lifecycle } from "./lifecycle";

export class Daemon extends Lifecycle {
    constructor(protected readonly runnable: Lifecycle) {
        super();
    }

    protected override async onstart(): Promise<void> {
        super.onstart();

        await this.runnable.start();
    }

    protected override async onstop(): Promise<void> {
        await super.onstop();

        await this.runnable.stop();
    }

    public override async stop(): Promise<void> {
        await super.stop();

        process.exit(0);
    }

    public override toString(): string {
        return `${super.toString()}[Daemon]`;
    }
}
