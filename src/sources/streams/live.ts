import { ImageFrame } from "../../tasks";
import { JpegStream } from "./formats";

export class LiveJpegStream extends JpegStream {
    protected onimage(buffer: Buffer): ImageFrame {
        return {
            image: { buffer, contentType: "image/jpeg" },
            seek: Date.now() / 1000,
            version: 1,
            annotations: [],
        };
    }
}
