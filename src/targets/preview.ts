import { ImageFrame, ImageTask } from "../tasks";
import { Ffplay } from "../spawn/ffplay";
import { DataConsumer } from "../sources/streams/transport";

type DataFormat = "mjpeg" | "mpegts";

export class Preview extends Ffplay implements DataConsumer, ImageTask {
    constructor(format: DataFormat = "mjpeg", title = "Preview") {
        const args = [
            "-loglevel",
            "quiet",
            "-f",
            format,
            "-i",
            "pipe:0",
            "-window_title",
            title,
        ];

        super(args);
    }

    public ondata(data: Buffer): Promise<void> | void {
        if (!this.running) return;

        this.child.stdin.write(data);
    }

    public async process(frame: ImageFrame): Promise<ImageFrame | null> {
        if (!this.running) return frame;

        this.child.stdin.write(frame.image.buffer);

        return frame;
    }

    protected override async onstop(): Promise<void> {
        this.child.stdin.end();

        await super.onstop();
    }

    public override toString(): string {
        return `${super.toString()}[Preview]`;
    }
}
