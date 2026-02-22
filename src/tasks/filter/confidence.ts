import { ImageFrame, ImageTask } from "..";

export class ConfidenceFilter implements ImageTask {
    constructor(private readonly threshold = 0.5) {}

    public async process(frame: ImageFrame): Promise<ImageFrame | null> {
        return {
            ...frame,
            annotations: frame.annotations.filter(
                (annotation) => (annotation.confidence ?? 0) >= this.threshold,
            ),
        };
    }

    public toString(): string {
        return `[ConfidenceFilter]`;
    }
}
