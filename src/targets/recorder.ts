import path from "node:path";
import { promises as fs } from "node:fs";
import { Ffmpeg } from "../spawn/ffmpeg";
import { DataConsumer } from "../sources/streams/transport";

export class Recorder extends Ffmpeg implements DataConsumer {
    constructor(private readonly folder: string) {
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

        await fs.mkdir(this.folder, { recursive: true });
    }

    public override toString(): string {
        return `${super.toString()}[Recorder]`;
    }
}
