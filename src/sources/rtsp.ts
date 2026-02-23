import { Ffmpeg } from "./ffmpeg";

export class RtspCamera extends Ffmpeg {
    constructor(url: string, interval: number = 5) {
        const fps = 1 / interval;
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

        console.info(this.toString(), `FPS: ${fps}`);
    }
}
