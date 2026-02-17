import { ActiveWebSocket } from "./active";
import { EventMessage, EventSession } from "./event";
import { Lifecycle } from "../lifecycle";

const WSS_URL = process.env.LIVEIMAGE_WSS_PUBLISH!;
const ADMIN_KEY = process.env.LIVEIMAGE_ADMIN_KEY!;

export interface OnlineMessage extends EventMessage {
    active: number;
    zombies: number;
    subscribers: number;
    publishers: number;
}

class PublisherWebSocket extends ActiveWebSocket {
    public static readonly Factory = () => new this();

    constructor() {
        super(new URL(WSS_URL), {
            headers: { Authorization: "Bearer " + ADMIN_KEY },
        });
    }

    public override toString(): string {
        return `${super.toString()}[PublisherWebSocket-${this.id}]`;
    }
}

export class PublisherSession extends EventSession {
    constructor(private readonly agent: Lifecycle) {
        super(PublisherWebSocket.Factory);
    }

    protected override async handle(msg: EventMessage): Promise<void> {
        console.debug(this.toString(), msg);
        switch (msg.event) {
            case "online":
                const online = msg as OnlineMessage;
                if (online.active > 0) this.agent.start();
                else this.agent.stop();
                break;
        }
    }

    protected override async onstop(): Promise<void> {
        await super.onstop();
        await this.agent.stop();
    }
}
