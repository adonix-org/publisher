import WebSocket from "ws";
import { Heartbeat } from "./heartbeat";
import { ClientRequestArgs } from "node:http";
import { HeartbeatOptions } from "../interfaces";
import { BaseWebSocket } from "./base";

export abstract class ActiveWebSocket extends BaseWebSocket {
    private static readonly CLOSE_TIMEOUT = 5_000;

    private heartbeat: Heartbeat;

    constructor(url: URL, args: ClientRequestArgs, options?: HeartbeatOptions) {
        super(url, args);

        this.heartbeat = new Heartbeat(this, () => this.close(), options);

        console.info(this.toString(), "connecting...");

        this.once("open", () => {
            console.info(this.toString(), "connected");
            this.heartbeat.start();
        });

        this.once("close", (code: number, reason: Buffer) => {
            this.heartbeat.stop();
            console.info(this.toString(), "closed", code, reason.toString());
        });

        this.once("error", (error: ErrorEvent) => {
            console.error(this.toString(), error);
        });
    }

    public override async close(code?: number, reason?: string): Promise<void> {
        if (this.readyState !== WebSocket.OPEN) return;

        this.heartbeat.stop();

        return new Promise<void>((resolve) => {
            const timeout = setTimeout(() => {
                console.warn(this.toString(), "terminated");
                this.terminate();
            }, ActiveWebSocket.CLOSE_TIMEOUT);

            this.once("close", () => {
                clearTimeout(timeout);
                resolve();
            });

            super.close(code, reason);
        });
    }

    public override toString(): string {
        return "[ActiveWebSocket]";
    }
}
