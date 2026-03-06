import { ImageFrame, ImageTask } from "..";

export class ConfidenceFilter implements ImageTask {
    constructor(
        private readonly threshold: number,
        private readonly label?: string,
    ) {}

    public async process(frame: ImageFrame): Promise<ImageFrame | null> {
        const annotations = frame.annotations.map((annotation) => {
            if (!annotation.active) return annotation;

            if (this.label && annotation.label !== this.label)
                return annotation;

            const confidence = annotation.confidence ?? 0;
            if (confidence < this.threshold) {
                return {
                    ...annotation,
                    active: false,
                    reason: `confidence < ${this.threshold}`,
                };
            }
            return annotation;
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
