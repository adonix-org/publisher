import { ImageFrame } from "../../tasks";
import { JpegStream } from "./formats";

export class FixedFpsStream extends JpegStream {
    private frameIndex = 0;

    constructor(private readonly fps: number) {
        super();
    }

    protected override onimage(buffer: Buffer): ImageFrame {
        const seek = this.frameIndex / this.fps;
        this.frameIndex++;

        return {
            image: { buffer, contentType: "image/jpeg" },
            seek,
            version: 1,
            annotations: [],
        };
    }

    public override toString(): string {
        return `${super.toString()}[FixedFpsStream]`;
    }
}
