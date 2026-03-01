import { Writable } from "node:stream";
import { Lifecycle } from "../../lifecycle";

export interface DataConsumer {
    getWritable(): Writable;
}

export class TransportStream extends Lifecycle {
    protected consumers: DataConsumer[] = [];

    public addConsumer(consumer: DataConsumer): this {
        this.consumers.push(consumer);

        return this;
    }

    public override toString(): string {
        return `${super.toString()}[TransportStream]`;
    }
}
