import { ImageFrame, ImageTask } from "..";

type Point = { x: number; y: number };

export class Ignore implements ImageTask {
    constructor(
        private readonly point: Point,
        private readonly radius: number,
    ) {}

    public async process(frame: ImageFrame): Promise<ImageFrame | null> {
        const annotations = frame.annotations.map((annotation) => {
            if (!annotation.active) return annotation;

            const centerX = annotation.x + annotation.width / 2;
            const centerY = annotation.y + annotation.height / 2;

            const dx = centerX - this.point.x;
            const dy = centerY - this.point.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= this.radius) {
                return {
                    ...annotation,
                    active: false,
                    reason: "inside ignore radius",
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
        return "[Ignore]";
    }
}
