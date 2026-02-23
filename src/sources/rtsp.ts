import { Ffmpeg } from "./ffmpeg";

export class Rtsp extends Ffmpeg {
    private static readonly MIN_FPS = 15;

    constructor(url: string, interval: number = 5) {
        const fps = Math.min(1 / interval, Rtsp.MIN_FPS);
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

        super(args);
    }

    public override toString(): string {
        return `${super.toString()}[RTSP]`;
    }
}
