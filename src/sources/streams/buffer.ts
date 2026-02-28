import { Lifecycle } from "../../lifecycle";
import { TSPacket, TSPacketConsumer } from "./transport";

export class PacketBuffer extends Lifecycle implements TSPacketConsumer {
    private readonly _packets: TSPacket[];
    private index = 0;
    private count = 0;

    constructor(private readonly maxSize: number = 1024) {
        super();
        this._packets = new Array(maxSize);
    }

    onpacket(packet: TSPacket): void {
        this._packets[this.index] = packet;
        this.index = (this.index + 1) % this.maxSize;
        if (this.count < this.maxSize) this.count++;
    }

    public *packets(): IterableIterator<TSPacket> {
        for (let i = 0; i < this.count; i++) {
            const idx = (this.index + i) % this.maxSize;
            yield this._packets[idx]!;
        }
    }
}
