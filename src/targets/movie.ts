import { Ffmpeg } from "../spawn/ffmpeg";
import { ImageFrame, ImageTask } from "../tasks";

export class Movie extends Ffmpeg implements ImageTask {
    constructor(fps: number, outputPath: string) {
        const args = [
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
            outputPath,
        ];
        super(args);
    }

    public async process(frame: ImageFrame): Promise<ImageFrame | null> {
        this.child.stdin.write(frame.image.buffer);
        return frame;
    }

    public override async onstop(): Promise<void> {
        this.child.stdin.end();
    }

    public override toString(): string {
        return `${super.toString()}[Movie]`;
    }
}
