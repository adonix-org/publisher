import { ImageFrame, ImageTask } from "..";

export class SubjectFilter implements ImageTask {
    constructor(
        private readonly label: string,
        private readonly threshold?: number,
    ) {}

    public async process(frame: ImageFrame): Promise<ImageFrame | null> {
        const filtered = frame.annotations.filter((annotation) => {
            if (annotation.label !== this.label) return true; // keep other labels
            if (this.threshold === undefined) return false; // remove all of this label
            return (annotation.confidence ?? 0) >= this.threshold; // keep if above threshold
        });
        return {
            ...frame,
            annotations: filtered,
        };
    }

    public toString(): string {
        return `[LabelFilter]`;
    }
}
