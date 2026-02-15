import WebSocket from "ws";

export class BaseWebSocket extends WebSocket {
    private static counter = 0;
    private readonly _id = BaseWebSocket.counter++;

    public get id(): number {
        return this._id;
    }

    public override toString(): string {
        return "[BaseWebSocket]";
    }
}
