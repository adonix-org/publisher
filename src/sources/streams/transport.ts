import { Lifecycle } from "../../lifecycle";

export interface TSPacket {
    payload: Buffer;
    timestamp: number;
}

export interface TSPacketConsumer {
    onpacket(packet: TSPacket): Promise<void> | void;
}

export type TSPacketListener = Lifecycle & TSPacketConsumer;

export class TransportStream extends Lifecycle<TSPacketListener> {
    private static readonly TS_SYNC_BYTE = 0x47;
    private static readonly TS_PACKET_SIZE = 188;

    private leftover = Buffer.alloc(0);

    constructor(...children: TSPacketListener[]) {
        super(...children);
    }

    protected override async onstart(): Promise<void> {
        await super.onstart();

        this.leftover = Buffer.alloc(0);
    }

    public ondata(chunk: Buffer): void {
        let buffer = Buffer.concat([this.leftover, chunk]);
        let offset = 0;

        while (offset + TransportStream.TS_PACKET_SIZE <= buffer.length) {
            if (buffer[offset] !== TransportStream.TS_SYNC_BYTE) {
                const nextSync = buffer.indexOf(
                    TransportStream.TS_SYNC_BYTE,
                    offset + 1,
                );

                if (nextSync === -1) {
                    break;
                }

                console.warn(
                    `TS packet missing sync byte at offset ${offset}, resyncing to ${nextSync}`,
                );

                offset = nextSync;
                if (offset + TransportStream.TS_PACKET_SIZE > buffer.length) {
                    break;
                }
            }

            const packetBuffer = buffer.subarray(
                offset,
                offset + TransportStream.TS_PACKET_SIZE,
            );

            const packet: TSPacket = {
                payload: packetBuffer,
                timestamp: performance.now(),
            };

            for (const listener of this.children) {
                this.callback(listener.onpacket, packet);
            }

            offset += TransportStream.TS_PACKET_SIZE;
        }

        this.leftover = buffer.subarray(offset);
    }
}
