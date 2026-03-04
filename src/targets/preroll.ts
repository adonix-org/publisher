import { Readable, PassThrough } from "stream";
import { Lifecycle } from "../lifecycle";
import { Broadcast } from "../sources/broadcast";

export class PreRoll extends Lifecycle implements Broadcast {
    private readonly buffer: Buffer[] = [];
    private size = 0;

    constructor(
        private readonly broadcast: Broadcast,
        private readonly maxSize: number = 128 * 1024,
    ) {
        super();
    }

    private subscribers = new Set<PassThrough>();

    public subscribe(): Readable {
        const out = new PassThrough();

        // send preroll
        for (const chunk of this.buffer) {
            out.write(chunk);
        }

        this.subscribers.add(out);

        const cleanup = () => {
            this.subscribers.delete(out);
            out.end();
        };

        out.on("close", cleanup);
        out.on("error", cleanup);

        return out;
    }

    protected override async onstart(): Promise<void> {
        await super.onstart();

        const upstream = this.broadcast.subscribe();

        upstream.on("data", (chunk: Buffer) => {
            // maintain preroll
            this.buffer.push(chunk);
            this.size += chunk.length;
            while (this.size > this.maxSize && this.buffer.length) {
                const removed = this.buffer.shift()!;
                this.size -= removed.length;
            }

            // fan out to all subscribers
            for (const sub of this.subscribers) {
                sub.write(chunk);
            }
        });

        upstream.on("end", () => {
            for (const sub of this.subscribers) {
                sub.end();
            }
        });
    }
}
