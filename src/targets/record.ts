import path from "node:path";
import { promises as fs } from "node:fs";
import { Ffmpeg } from "../spawn/ffmpeg";
import { ImageFrame, ImageTask } from "../tasks";

export class Record extends Ffmpeg implements ImageTask {
    constructor(
        fps: number,
        private readonly output: string,
    ) {
        const args = [
            "-loglevel",
            "fatal",
            "-y",
            "-f",
            "image2pipe",
            "-vcodec",
            "mjpeg",
            "-r",
            fps.toString(),
            "-i",
            "-",
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            output,
        ];
        super(args);
    }

    public async process(frame: ImageFrame): Promise<ImageFrame | null> {
        this.child.stdin.write(frame.image.buffer);

        return frame;
    }

    public override async onstart(): Promise<void> {
        await super.onstart();

        const folder = path.dirname(this.output);
        await fs.mkdir(folder, { recursive: true });
    }

    public override async onstop(): Promise<void> {
        this.child.stdin.end();

        await super.onstop();
    }

    public override toString(): string {
        return `${super.toString()}[Movie]`;
    }
}
