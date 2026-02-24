import { Ffmpeg } from "./ffmpeg";
import { FixedFpsStream } from "./streams/fixed";

export class FileSource extends Ffmpeg {
    constructor(path: string, fps: number = 15) {
        const args = [
            "-loglevel",
            "error",
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

        super(args, new FixedFpsStream(fps));
    }

    public override toString(): string {
        return `${super.toString()}[File]`;
    }
}
