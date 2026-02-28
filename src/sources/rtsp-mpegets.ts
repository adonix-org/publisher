import { Ffmpeg } from "../spawn/ffmpeg";
import { StreamBuffer } from "./streams/buffer";

export class RtspMpegTs extends Ffmpeg {
    constructor(
        private readonly stream: StreamBuffer,
        url: string,
    ) {
        const args = [
            "-loglevel",
            "fatal",
            "-rtsp_transport",
            "tcp",
            "-use_wallclock_as_timestamps",
            "1",
            "-i",
            url,
            "-an",
            "-c",
            "copy",
            "-f",
            "mpegts",
            "pipe:1",
        ];

        super(args);

        this.register(stream);
    }

    protected override async onstart(): Promise<void> {
        await super.onstart();

        this.stream.clear();

        this.child.stdout.on("data", (chunk) => {
            this.stream.ondata(chunk);
        });
    }

    public override toString(): string {
        return `${super.toString()}[RtspMpegTs]`;
    }
}
