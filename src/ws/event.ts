import WebSocket from "ws";
import { EventMessage } from "../interfaces";
import { WebSocketSession } from "./session";

export abstract class EventSession extends WebSocketSession {
    protected abstract handle(msg: EventMessage): void | Promise<void>;

    protected override async onmessage(
        data: WebSocket.RawData,
        _isBinary: boolean,
    ): Promise<void> {
        const raw = data.toString();

        const json = this.safeParse(raw);
        if (!json || (typeof json === "object" && !("event" in json))) {
            console.error(this.toString(), "Invalid event object:", raw);
            return;
        }

        await this.safeHandle(json as EventMessage);
    }

    private safeParse(raw: string): unknown | null {
        try {
            return JSON.parse(raw);
        } catch (err) {
            console.error(this.toString(), "Failed to parse JSON:", raw, err);
            return null;
        }
    }

    private async safeHandle(msg: EventMessage): Promise<void> {
        try {
            await this.handle(msg);
        } catch (err) {
            console.error(this.toString(), "Error handling event:", msg, err);
        }
    }
}
