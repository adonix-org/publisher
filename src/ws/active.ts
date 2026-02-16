import WebSocket from "ws";
import { Heartbeat } from "./heartbeat";
import { ClientRequestArgs } from "node:http";
import { HeartbeatOptions } from "../interfaces";
import { BaseWebSocket } from "./base";

export class ActiveWebSocket extends BaseWebSocket {
    private readonly heartbeat: Heartbeat;

    constructor(
        address: string | URL,
        options?: WebSocket.ClientOptions | ClientRequestArgs,
        heartbeat?: HeartbeatOptions,
    ) {
        super(address, options);

        this.heartbeat = new Heartbeat(this, () => this.close(), heartbeat);

        console.info(this.toString(), "connecting...");

        this.once("open", async () => {
            console.info(this.toString(), "connected");
            await this.heartbeat.start();
        });

        this.once("close", async (code: number, reason: Buffer) => {
            await this.heartbeat.stop();
            console.info(this.toString(), "closed", code, reason.toString());
        });

        this.once("error", (error: ErrorEvent) => {
            console.error(this.toString(), error);
        });
    }

    public override close(code?: number, data?: string | Buffer): void {
        console.info(this.toString(), "closing...");
        this.heartbeat.stop();
        super.close(code, data);
    }

    public override toString(): string {
        return "[ActiveWebSocket]";
    }
}
