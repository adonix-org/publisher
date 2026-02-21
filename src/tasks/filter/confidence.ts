import { ImageFrame, ImageTask } from "..";

export class Confidence implements ImageTask {
    constructor(
        private readonly threshold = 0.5,
        private readonly label?: string,
    ) {}

    public async process(frame: ImageFrame): Promise<ImageFrame | null> {
        const filtered = frame.annotations.filter(
            (annotation) =>
                (!this.label || annotation.label === this.label) &&
                (annotation.confidence ?? 0) >= this.threshold,
        );
        return {
            ...frame,
            annotations: filtered,
        };
    }

    public toString(): string {
        return `[Confidence]`;
    }
}
