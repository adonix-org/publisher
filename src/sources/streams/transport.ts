import { Lifecycle } from "../../lifecycle";

export interface DataConsumer {
    ondata(data: Buffer): Promise<void> | void;
}

export class TransportStream extends Lifecycle implements DataConsumer {
    protected consumers: DataConsumer[] = [];

    public addConsumer(consumer: DataConsumer): this {
        this.consumers.push(consumer);

        return this;
    }

    public ondata(data: Buffer): void {
        if (!this.running) return;

        setImmediate(() => {
            for (const consumer of this.consumers) {
                consumer.ondata(data);
            }
        });
    }

    public override toString(): string {
        return `${super.toString()}[TransportStream]`;
    }
}
