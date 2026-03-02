import { ImageFrame, ImageTask } from "..";
import { Executable } from "../../spawn/executable";

export class ViewerTask extends Executable implements ImageTask {
    constructor(private readonly title = "Task Viewer") {
        super();
    }

    protected override executable(): string {
        return "/opt/homebrew/bin/ffplay";
    }

    protected override args(): string[] {
        const args = [
            "-loglevel",
            "quiet",
            "-fflags",
            "nobuffer",
            "-f",
            "mjpeg",
            "-i",
            "pipe:0",
            "-window_title",
            this.title,
        ];
        return args;
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
        return `${super.toString()}[ViewerTask]`;
    }
}
