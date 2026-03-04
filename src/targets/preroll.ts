import { Readable } from "node:stream";
import { Lifecycle } from "../lifecycle";
import { Broadcast } from "../sources/broadcast";
import { Subscribers } from "../sources/subscribers";

export class PreRoll extends Lifecycle implements Broadcast {
    private readonly subscribers = new Subscribers(1024 * 1024);
    private upstream: Readable | undefined;

    private readonly buffer: Buffer[] = [];
    private size = 0;

    constructor(
        private readonly broadcast: Broadcast,
        private readonly maxSize: number = 1024 * 1024,
    ) {
        super();
    }

    public subscribe(): Readable {
        const subscriber = this.subscribers.subscribe();

        for (const chunk of this.buffer) {
            const free = subscriber.write(chunk);
            if (!free) {
                console.warn(
                    this.toString(),
                    `backpressure detected sending preroll`,
                );
            }
        }

        return subscriber;
    }

    protected override async onstart(): Promise<void> {
        await super.onstart();

        this.upstream = this.broadcast.subscribe();

        this.upstream.on("data", (chunk: Buffer) => {
            this.buffer.push(chunk);

            this.subscribers.send(chunk);

            this.size += chunk.length;
            while (this.size > this.maxSize && this.buffer.length) {
                const removed = this.buffer.shift()!;
                this.size -= removed.length;
            }
        });
    }

    public override toString(): string {
        return `${super.toString()}[PreRoll]`;
    }
}
