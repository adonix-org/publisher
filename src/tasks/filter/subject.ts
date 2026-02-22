import { ImageFrame, ImageTask } from "..";

export class SubjectFilter implements ImageTask {
    constructor(
        private readonly label: string,
        private readonly threshold?: number,
    ) {}

    public async process(frame: ImageFrame): Promise<ImageFrame | null> {
        const filtered = frame.annotations.filter((annotation) => {
            if (annotation.label !== this.label) return true;
            if (this.threshold === undefined) return false;
            return (annotation.confidence ?? 0) >= this.threshold;
        });

        return {
            ...frame,
            annotations: filtered,
        };
    }

    public toString(): string {
        return `[SubjectFilter]`;
    }
}
