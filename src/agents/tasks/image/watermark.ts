import sharp from "sharp";
import { ImageBuffer, ImageTask } from "../../interfaces";

export class Watermark implements ImageTask {
    private cachedOverlay?: Buffer;

    constructor(
        private text: string = "LiveImage",
        private fontSize: number = 80,
        private position: sharp.Gravity = "southeast",
    ) {}

    private async getOverlay(): Promise<Buffer> {
        if (this.cachedOverlay) return this.cachedOverlay;

        const padding = 20;
        const estimatedWidth =
            this.text.length * this.fontSize * 0.6 + padding * 2;
        const estimatedHeight = this.fontSize + padding * 2;

        const svg = `
<svg width="${estimatedWidth}" height="${estimatedHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="3" dy="3" stdDeviation="4" flood-color="black" flood-opacity="0.8"/>
    </filter>
  </defs>
  <text
    x="${estimatedWidth - padding}"
    y="50%"
    font-size="${this.fontSize}"
    fill="rgba(255,255,255,0.6)"
    font-family="sans-serif"
    text-anchor="end"
    dominant-baseline="middle"
    filter="url(#shadow)"
  >${this.text}</text>
</svg>
`;

        this.cachedOverlay = await sharp(Buffer.from(svg)).png().toBuffer();

        return this.cachedOverlay;
    }

    public async process(image: ImageBuffer): Promise<ImageBuffer | null> {
        const overlay = await this.getOverlay();

        const buffer = await sharp(image.buffer)
            .composite([{ input: overlay, gravity: this.position }])
            .toBuffer();

        return { buffer, contentType: image.contentType };
    }

    public toString(): string {
        return "[Watermark]";
    }
}
