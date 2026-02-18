import sharp from "sharp";
import { ImageBuffer, ImageTask } from "../../interfaces";

export class Whiteout implements ImageTask {
    constructor(private readonly opacity: number = 1) {}

    public async process(image: ImageBuffer): Promise<ImageBuffer | null> {
        const meta = await sharp(image.buffer).metadata();
        const width = meta.width;
        const height = meta.height;

        const whiteOverlay = await sharp({
            create: {
                width,
                height,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: this.opacity },
            },
        })
            .png()
            .toBuffer();

        const buffer = await sharp(image.buffer)
            .composite([
                {
                    input: whiteOverlay,
                    blend: "over",
                },
            ])
            .toBuffer();

        return { buffer, contentType: image.contentType };
    }

    public toString(): string {
        return `[Whiteout]`;
    }
}
