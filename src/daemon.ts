import { Lifecycle } from "./lifecycle";
import { WebSocketSession } from "./ws/session";

export class Daemon extends Lifecycle {
    constructor(protected readonly session: WebSocketSession) {
        super();
    }

    protected override async onstart(): Promise<void> {
        await this.session.start();
    }

    protected override async onstop(): Promise<void> {
        await this.session.stop();
    }

    public override async stop(): Promise<void> {
        await super.stop();

        process.exit(0);
    }

    public override toString(): string {
        return `${super.toString()}[Daemon]`;
    }
}
