import { ImageFrame } from "../../tasks";
import { FrameQueue } from "../queue";

export abstract class ImageStream extends FrameQueue {
    private chunks: Buffer[] = [];
    private totalLength = 0;
    private scanOffset = 0;

    protected abstract get soi(): Buffer;
    protected abstract get eoi(): Buffer;

    protected abstract onimage(buffer: Buffer): ImageFrame;

    public override clear(): void {
        super.clear();

        this.chunks = [];
        this.scanOffset = 0;
        this.totalLength = 0;
    }

    public ondata(chunk: Buffer): void {
        this.chunks.push(chunk);
        this.totalLength += chunk.length;

        let buffer = Buffer.concat(this.chunks, this.totalLength);
        let start = buffer.indexOf(this.soi, this.scanOffset);
        let end: number;

        while (
            start !== -1 &&
            (end = buffer.indexOf(this.eoi, start + 2)) !== -1
        ) {
            const image = buffer.subarray(start, end + 2);
            this.push(this.onimage(image));
            this.scanOffset = end + 2;
            start = buffer.indexOf(this.soi, this.scanOffset);
        }

        if (this.scanOffset > 0) {
            buffer = buffer.subarray(this.scanOffset);
            this.chunks = [buffer];
            this.totalLength = buffer.length;
            this.scanOffset = 0;
        }
    }
}
