import { Canvas, createCanvas, loadImage } from "canvas";
import { ImageFrame, ImageTask } from "..";

export interface Stage {
    draw(frame: ImageFrame, canvas: Canvas): Promise<Canvas>;

    toString(): string;
}

export class Drawing implements ImageTask {
    private readonly stages: Stage[] = [];

    constructor(...stages: Stage[]) {
        this.stages.push(...stages);
    }

    public add(stage: Stage, ...stages: Stage[]): void {
        this.stages.push(stage, ...stages);
    }

    public async process(frame: ImageFrame): Promise<ImageFrame | null> {
        const image = await loadImage(frame.image.buffer);

        let canvas = createCanvas(image.width, image.height);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);

        for (const stage of this.stages) {
            canvas = await stage.draw(frame, canvas);
        }

        frame.image.buffer = canvas.toBuffer("image/jpeg", { quality: 0.95 });

        return frame;
    }

    public toString(): string {
        return "Draw";
    }
}
