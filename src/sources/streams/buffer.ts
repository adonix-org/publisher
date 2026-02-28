import { Lifecycle } from "../../lifecycle";

export class StreamBuffer extends Lifecycle {
    private static readonly TS_SYNC_BYTE = 0x47;
    private static readonly TS_PACKET_SIZE = 188;
    private static readonly MAX_BUFFER_SIZE = 1024;

    private readonly packets: Buffer[] = [];

    // Keep a list of consumers to send chunks to here?  Or in RtspMpegTs?

    public clear(): void {
        this.packets.length = 0;
    }

    public ondata(chunk: Buffer): void {
        let offset = 0;

        while (offset + StreamBuffer.TS_PACKET_SIZE <= chunk.length) {
            const packet: Buffer = chunk.subarray(
                offset,
                offset + StreamBuffer.TS_PACKET_SIZE,
            );

            if (packet[0] !== StreamBuffer.TS_SYNC_BYTE) {
                console.warn("TS packet missing sync byte at offset", offset);
            }

            this.packets.push(packet);

            while (this.packets.length > StreamBuffer.MAX_BUFFER_SIZE) {
                this.packets.shift();
            }

            offset += StreamBuffer.TS_PACKET_SIZE;
        }
    }
}
