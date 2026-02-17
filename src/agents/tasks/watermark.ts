import sharp from "sharp";
import { ImageBuffer, ImageTask } from "../interfaces";

export class Watermark implements ImageTask {
    constructor(
        private readonly text: string = "LiveImage",
        private readonly fontSize: number = 100, // px
        private readonly opacity: number = 0.8, // 0–1
    ) {}

    public async process(image: ImageBuffer): Promise<ImageBuffer | null> {
        const meta = await sharp(image.buffer).metadata();
        const width = meta.width ?? 1000; // fallback width
        const height = meta.height ?? 1000; // fallback height
        const padding = 30;

        const svg = `
<svg width="${width}" height="${height}">
  <text
    x="${width - padding}"
    y="${height - padding}"
    font-size="${this.fontSize}"
    fill="white"
    fill-opacity="${this.opacity}"
    font-family="sans-serif"
    text-anchor="end"
    alignment-baseline="alphabetic"
  >${this.text}</text>
</svg>
`;

        const overlay = Buffer.from(svg);

        const buffer = await sharp(image.buffer)
            .composite([{ input: overlay }])
            .toBuffer();

        console.info(
            "source:",
            image.buffer.byteLength,
            "watermarked:",
            buffer.byteLength,
        );

        return { buffer, contentType: image.contentType };
    }

    public toString(): string {
        return `[Watermark]`;
    }
}
