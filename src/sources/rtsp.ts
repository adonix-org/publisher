import { ImageFrame } from "../tasks";
import { Ffmpeg } from "./ffmpeg";
import { JpegStream } from "./stream";

class RtspStream extends JpegStream {
    protected onimage(buffer: Buffer): ImageFrame {
        return {
            image: { buffer, contentType: "image/jpeg" },
            seek: Date.now() / 1000,
            version: 1,
            annotations: [],
        };
    }
}

export class Rtsp extends Ffmpeg {
    private static readonly MAX_FPS = 15;

    constructor(url: string, interval: number = 5) {
        const fps = Math.min(Rtsp.MAX_FPS, 1 / interval);
        const args = [
            "-loglevel",
            "fatal",
            "-timeout",
            "50000000",
            "-rtsp_transport",
            "tcp",
            "-i",
            url,
            "-vf",
            `fps=${fps}`,
            "-f",
            "image2pipe",
            "-vcodec",
            "mjpeg",
            "pipe:1",
        ];

        super(args, new RtspStream());
    }

    public override toString(): string {
        return `${super.toString()}[RTSP]`;
    }
}
