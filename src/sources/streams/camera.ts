import { ImageFrame } from "../../tasks";
import { JpegStream } from "./formats";

export class CameraStream extends JpegStream {
    protected onimage(buffer: Buffer): ImageFrame {
        return {
            image: { buffer, contentType: "image/jpeg" },
            seek: Date.now() / 1000,
            version: 1,
            annotations: [],
        };
    }

    public override toString(): string {
        return `${super.toString()}[CameraStream]`;
    }
}
