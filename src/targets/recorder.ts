import path from "node:path";
import { promises as fs } from "node:fs";
import { Ffmpeg } from "../spawn/ffmpeg";
import { StreamProvider } from "../sources/rtsp";
import { PassThrough } from "node:stream";

export class Recorder extends Ffmpeg {
    constructor(
        private readonly provider: StreamProvider,
        private readonly folder: string,
    ) {
        const file = path.join(folder, "output.mp4");
        const args = [
            "-loglevel",
            "fatal",
            "-y",
            "-f",
            "mpegts",
            "-i",
            "pipe:0",
            "-c",
            "copy",
            file,
        ];

        super(args);
    }

    protected override async onstart(): Promise<void> {
        await super.onstart();

        const buffer = new PassThrough({ highWaterMark: 256 * 1024 });
        this.provider.getStream().pipe(buffer).pipe(this.child.stdin);

        await fs.mkdir(this.folder, { recursive: true });
    }

    public override toString(): string {
        return `${super.toString()}[Recorder]`;
    }
}
