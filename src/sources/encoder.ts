import { ImageSource } from ".";
import { ImageFrame } from "../tasks";
import { Ffmpeg } from "../spawn/ffmpeg";
import { ImageStream } from "./streams/image";
import { DataConsumer } from "./streams/transport";

export class Encoder extends Ffmpeg implements DataConsumer, ImageSource {
    constructor(
        private readonly stream: ImageStream,
        fps: number = 15,
    ) {
        const args = [
            "-loglevel",
            "fatal",
            "-i",
            "pipe:0",
            "-vf",
            `fps=${fps}`,
            "-f",
            "image2pipe",
            "-vcodec",
            stream.vcodec,
            "pipe:1",
        ];

        super(args);

        this.register(stream);
    }

    public ondata(data: Buffer): Promise<void> | void {
        this.child.stdin.write(data);
    }

    public async next(): Promise<ImageFrame | null> {
        return this.stream.next();
    }

    protected override async onstart(): Promise<void> {
        await super.onstart();

        this.stream.clear();

        this.child.stdout.on("data", (data) => {
            this.stream.ondata(data);
        });
    }

    public override toString(): string {
        return `${super.toString()}[Mjpeg]`;
    }
}
