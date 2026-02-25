import { Ffmpeg } from "./ffmpeg";
import { ImageStream } from "./streams/image";

export class RtspSource extends Ffmpeg {
    constructor(stream: ImageStream, url: string, fps: number = 1) {
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
