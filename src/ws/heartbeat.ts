import { WebSocket } from "ws";
import { HeartbeatOptions } from "../interfaces";

export class Heartbeat {
    public static readonly DEFAULT_PULSE = 10_000;
    public static readonly DEFAULT_TIMEOUT = 5_000;

    private pulse: NodeJS.Timeout | undefined;
    private timeout: NodeJS.Timeout | undefined;

    constructor(
        private readonly websocket: WebSocket,
        private readonly onTimeout: () => Promise<void>,
        private readonly options: HeartbeatOptions = {
            pulse: Heartbeat.DEFAULT_PULSE,
            timeout: Heartbeat.DEFAULT_TIMEOUT,
        },
    ) {}

    public start(): void {
        this.stop();

        this.pulse = setInterval(() => {
            this.ping();
        }, this.options.pulse);
    }

    public stop(): void {
        if (this.pulse) clearInterval(this.pulse);
        if (this.timeout) clearTimeout(this.timeout);

        this.pulse = undefined;
        this.timeout = undefined;
    }

    private pong = (): void => {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = undefined;
    };

    private ping(): void {
        if (this.websocket.readyState !== WebSocket.OPEN) return;
        if (this.timeout) return;

        this.timeout = setTimeout(() => {
            this.timeout = undefined;
            this.websocket.removeListener("pong", this.pong);

            console.warn(this.toString(), "timeout");
            this.onTimeout();
        }, this.options.timeout);

        this.websocket.once("pong", this.pong);
        this.websocket.ping();
    }

    public toString(): string {
        return `[Heartbeat]${this.websocket.toString()}`;
    }
}
