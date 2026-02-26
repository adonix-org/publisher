import { ImageFrame, ImageTask } from "..";

export class ConfidenceFilter implements ImageTask {
    constructor(
        private readonly threshold: number,
        private readonly label?: string,
    ) {}

    public async process(frame: ImageFrame): Promise<ImageFrame | null> {
        const annotations = frame.annotations.filter((annotation) => {
            if (this.label && annotation.label !== this.label) return true;
            return (annotation.confidence ?? 0) >= this.threshold;
        });

        return {
            ...frame,
            annotations,
        };
    }

    public toString(): string {
        return `[ConfidenceFilter]`;
    }
}
