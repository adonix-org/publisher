import sharp from "sharp";
import { ImageFrame, ImageTask } from "..";

export class Watermark implements ImageTask {
    private cachedOverlay?: Buffer;

    constructor(
        private readonly text: string,
        private readonly fontSize: number = 80,
        private readonly position: sharp.Gravity = "southeast",
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

    public async process(frame: ImageFrame): Promise<ImageFrame | null> {
        const overlay = await this.getOverlay();

        const buffer = await sharp(frame.image.buffer)
            .composite([{ input: overlay, gravity: this.position }])
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
        return "[Watermark]";
    }
}
