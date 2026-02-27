import { ImageSource } from ".";
import { ImageFrame } from "../tasks";
import { Ffmpeg } from "../spawn/ffmpeg";
import { ImageStream } from "./streams/image";

export class RtspSource extends Ffmpeg implements ImageSource {
    constructor(
        private readonly stream: ImageStream,
        url: string,
        fps: number = 5,
    ) {
        const args = [
            "-loglevel",
            "fatal",
            "-timeout",
            "50000000",
            "-i",
            url,
            "-rtsp_transport",
            "tcp",
            "-vf",
            `fps=${fps}`,
            "-f",
            "image2pipe",
            "-vcodec",
            "mjpeg",
            "pipe:1",
        ];

        super(args);

        this.register(stream);
    }

    public async next(): Promise<ImageFrame | null> {
        return this.stream.next();
    }

    public override async onstart(): Promise<void> {
        await super.onstart();

        this.stream.clear();

        this.child.stdout.on("data", (chunk) => {
            this.stream.ondata(chunk);
        });
    }

    public override toString(): string {
        return `${super.toString()}[RTSP]`;
    }
}
