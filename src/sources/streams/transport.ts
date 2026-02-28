import { Lifecycle } from "../../lifecycle";

export interface DataConsumer {
    ondata(chunk: Buffer): Promise<void> | void;
}

export type DataListener = Lifecycle & DataConsumer;

export class TransportStream
    extends Lifecycle<DataListener>
    implements DataConsumer
{
    constructor(...children: DataListener[]) {
        super(...children);
    }

    public ondata(chunk: Buffer): void {
        setImmediate(() => {
            for (const listener of this.children) {
                listener.ondata(chunk);
            }
        });
    }
}
