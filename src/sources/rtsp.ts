import { Ffmpeg } from "./ffmpeg";
import { ImageStream } from "./streams/stream";

export class Rtsp extends Ffmpeg {
    private static readonly MAX_FPS = 15;

    constructor(stream: ImageStream, url: string, interval: number = 5) {
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

        super(args, stream);
    }

    public override toString(): string {
        return `${super.toString()}[RTSP]`;
    }
}
