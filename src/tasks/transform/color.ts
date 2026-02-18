import sharp from "sharp";
import { ImageBuffer, ImageTask } from "../../agents/interfaces";

export class ColorOverlay implements ImageTask {
    constructor(private readonly color: string | sharp.Color = "black") {}

    public async process(image: ImageBuffer): Promise<ImageBuffer | null> {
        const meta = await sharp(image.buffer).metadata();
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

        const buffer = await sharp(image.buffer)
            .composite([
                {
                    input: colorOverlay,
                    blend: "over",
                },
            ])
            .toBuffer();

        return { buffer, contentType: image.contentType };
    }

    public toString(): string {
        return `[ColorOverlay-${JSON.stringify(this.color)}]`;
    }
}
