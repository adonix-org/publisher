import sharp from "sharp";
import { ImageFrame, ImageTask } from "..";

export class ColorOverlay implements ImageTask {
    constructor(private readonly color: string | sharp.Color = "black") {}

    public async process(frame: ImageFrame): Promise<ImageFrame | null> {
        const meta = await sharp(frame.image.buffer).metadata();
        const width = meta.width;
        const height = meta.height;

        const colorOverlay = await sharp({
            create: {
                width,
                height,
                channels: 4,
                background: this.color,
            },
        })
            .png()
            .toBuffer();

        const buffer = await sharp(frame.image.buffer)
            .composite([
                {
                    input: colorOverlay,
                    blend: "over",
                },
            ])
            .toBuffer();

        return {
            ...frame,
            image: {
                ...frame.image,
                buffer,
            },
        };
    }

    public toString(): string {
        return `[ColorOverlay-${JSON.stringify(this.color)}]`;
    }
}
