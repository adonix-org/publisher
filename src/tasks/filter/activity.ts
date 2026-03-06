import { ImageFrame, ImageTask } from "..";

export class ActivityFilter implements ImageTask {
    constructor(private readonly minimum: number = 1) {}

    public async process(frame: ImageFrame): Promise<ImageFrame | null> {
        const activeCount = frame.annotations.filter((a) => a.active).length;
        return activeCount >= this.minimum ? frame : null;
    }

    public toString(): string {
        return `[ActivityFilter]`;
    }
}
