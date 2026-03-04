import { PassThrough, Readable } from "node:stream";

export class Subscribers {
    private static readonly DEFAULT_HIGHWATER = 128 * 1024;
    private readonly subscribers: Set<PassThrough> = new Set();

    constructor(
        private readonly highwater: number = Subscribers.DEFAULT_HIGHWATER,
    ) {}

    public subscribe(): Readable {
        const subscriber = new PassThrough({ highWaterMark: this.highwater });

        this.subscribers.add(subscriber);

        const cleanup = () => {
            this.subscribers.delete(subscriber);
            subscriber.removeListener("end", cleanup);
            subscriber.removeListener("close", cleanup);
            subscriber.removeListener("error", cleanup);
        };

        subscriber.on("end", cleanup);
        subscriber.on("close", cleanup);
        subscriber.on("error", cleanup);
        subscriber.resume();

        return subscriber;
    }

    public send(chunk: Buffer): void {
        for (const subscriber of this.subscribers) {
            const free = subscriber.write(chunk);
            if (!free) {
                const overflow =
                    subscriber.writableLength -
                    subscriber.writableHighWaterMark;
                console.warn(
                    this.toString(),
                    `subscriber buffer memory exceeded ${overflow} bytes`,
                );
            }
        }
    }

    public toString(): string {
        return "[Subscribers]";
    }
}
