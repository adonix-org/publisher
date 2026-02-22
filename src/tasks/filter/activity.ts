import { ImageFrame, ImageTask } from "..";

export class ActivityFilter implements ImageTask {
    constructor(private readonly minimum: number = 1) {}

    public async process(frame: ImageFrame): Promise<ImageFrame | null> {
        if (frame.annotations.length >= this.minimum) return frame;

        return null;
    }

    public toString(): string {
        return `[ActivityFilter]`;
    }
}
