import sharp from "sharp";
import { ImageBuffer, ImageTask } from "../../interfaces";

export class Watermark implements ImageTask {
    constructor(
        private readonly text: string = "LiveImage",
        private readonly fontSize: number = 60,
        private readonly opacity: number = 0.6,
        private readonly position: sharp.Gravity = "southeast",
    ) {}

    public async process(image: ImageBuffer): Promise<ImageBuffer | null> {
        const padding = 10;

        // Rough width estimate: 0.6 * fontSize per character
        const estimatedWidth =
            this.text.length * this.fontSize * 0.6 + padding * 2;
        const estimatedHeight = this.fontSize + padding * 2;

        const svg = `
<svg width="${estimatedWidth}" height="${estimatedHeight}" xmlns="http://www.w3.org/2000/svg">

  <defs>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow 
          dx="3" 
          dy="3" 
          stdDeviation="4"
          flood-color="black"
          flood-opacity="0.8"/>
    </filter>
  </defs>

  <text
    x="50%"
    y="50%"
    font-size="${this.fontSize}"
    fill="white"
    fill-opacity="${this.opacity}"
    font-family="sans-serif"
    text-anchor="middle"
    dominant-baseline="middle"
    filter="url(#shadow)"
  >
    ${this.text}
  </text>
</svg>
`;

        const overlay = Buffer.from(svg);
        const buffer = await sharp(image.buffer)
            .composite([
                {
                    input: overlay,
                    gravity: this.position,
                },
            ])
            .toBuffer();

        return { buffer, contentType: image.contentType };
    }

    public toString(): string {
        return `[Watermark]`;
    }
}
