import { WebSocket } from "ws";
import { Lifecycle } from "../lifecycle";

export interface HeartbeatOptions {
    pulse: number;
    timeout: number;
}

export class Heartbeat extends Lifecycle {
    public static readonly DEFAULT_PULSE = 10_000;
    public static readonly DEFAULT_TIMEOUT = 5_000;

    private pulse: NodeJS.Timeout | undefined;
    private timeout: NodeJS.Timeout | undefined;

    constructor(
        private readonly websocket: WebSocket,
        private readonly onTimeout: () => void | Promise<void>,
        private readonly options: HeartbeatOptions = {
            pulse: Heartbeat.DEFAULT_PULSE,
            timeout: Heartbeat.DEFAULT_TIMEOUT,
        },
    ) {
        super();
    }

    protected override async onstart(): Promise<void> {
        await super.onstart();

        this.pulse = setInterval(() => {
            this.ping();
        }, this.options.pulse);
    }

    protected override async onstop(): Promise<void> {
        await super.onstop();

        if (this.pulse) clearInterval(this.pulse);
        if (this.timeout) clearTimeout(this.timeout);

        this.pulse = undefined;
        this.timeout = undefined;
    }

    private ping(): void {
        if (this.websocket.readyState !== WebSocket.OPEN) return;
        if (this.timeout) return;

        this.timeout = setTimeout(() => {
            this.timeout = undefined;
            this.websocket.removeListener("pong", this.pong);

            console.warn(this.toString(), "timeout");
            this.callback(this.onTimeout);
        }, this.options.timeout);

        this.websocket.once("pong", this.pong);
        this.websocket.ping();
    }

    private readonly pong = (): void => {
        if (!this.timeout) return;
        clearTimeout(this.timeout);
        this.timeout = undefined;
    };

    public override toString(): string {
        return `${super.toString()}[Heartbeat]${this.websocket.toString()}`;
    }
}
