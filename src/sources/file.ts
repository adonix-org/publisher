import { Ffmpeg } from "../spawn/ffmpeg";

export class FileSource extends Ffmpeg {
    constructor(path: string, fps: number = 15) {
        const args = [
            "-loglevel",
            "fatal",
            "-i",
            path,
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
        return `${super.toString()}[File]`;
    }
}
