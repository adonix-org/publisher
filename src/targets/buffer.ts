import { Lifecycle } from "../lifecycle";
import { DataConsumer } from "../sources/streams/transport";

export class DataBuffer extends Lifecycle implements DataConsumer {
    private readonly chunks: Buffer[] = [];
    private size = 0;

    constructor(private readonly maxSize: number = 1024 * 1024) {
        super();
    }

    public ondata(data: Buffer): void {
        this.chunks.push(data);
        this.size += data.length;

        while (this.size > this.maxSize) {
            const removed = this.chunks.shift()!;
            this.size -= removed.length;
        }
    }

    public getBuffer(): Buffer {
        return Buffer.concat(this.chunks, this.size);
    }

    public override toString(): string {
        return `${super.toString()}[DataBuffer]`;
    }
}
