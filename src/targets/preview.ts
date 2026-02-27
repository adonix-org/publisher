import { ImageFrame, ImageTask } from "../tasks";
import { Ffplay } from "../spawn/ffplay";

export class Preview extends Ffplay implements ImageTask {
    constructor(title: string = "Preview") {
        const args = [
            "-f",
            "mjpeg",
            "-i",
            "pipe:0",
            "-vf",
            "scale=-1:480",
            "-window_title",
            title,
            "-fflags",
            "nobuffer",
            "-flags",
            "low_delay",
            "-loglevel",
            "quiet",
        ];

        super(args);
    }

    public async process(frame: ImageFrame): Promise<ImageFrame | null> {
        this.child.stdin.write(frame.image.buffer);

        return frame;
    }

    public override async onstop(): Promise<void> {
        this.child.stdin.end();

        await super.onstop();
    }

    public override toString(): string {
        return `${super.toString()}[Preview]`;
    }
}
