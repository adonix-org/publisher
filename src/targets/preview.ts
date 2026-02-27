import { ImageFrame, ImageTask } from "../tasks";
import { Ffplay } from "../spawn/ffplay";

export class Preview extends Ffplay implements ImageTask {
    constructor(title: string = "Preview") {
        const args = [
            "-loglevel",
            "quiet",
            "-f",
            "mjpeg",
            "-i",
            "pipe:0",
            "-window_title",
            title,
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
