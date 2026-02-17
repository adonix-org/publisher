import sharp from "sharp";
import { ImageBuffer, ImageTask } from "../interfaces";

export type ConvertTarget =
    | {
          type: "image/jpeg";
          options?: sharp.JpegOptions;
      }
    | {
          type: "image/png";
          options?: sharp.PngOptions;
      }
    | {
          type: "image/webp";
          options?: sharp.WebpOptions;
      }
    | {
          type: "image/gif";
          options?: sharp.GifOptions;
      };

export class Convert implements ImageTask {
    constructor(private readonly target: ConvertTarget) {}

    public async process(image: ImageBuffer): Promise<ImageBuffer | null> {
        const source = sharp(image.buffer);

        let buffer: Buffer;
        switch (this.target.type) {
            case "image/jpeg":
                buffer = await source.jpeg(this.target.options).toBuffer();
                break;
            case "image/png":
                buffer = await source.png(this.target.options).toBuffer();
                break;
            case "image/webp":
                buffer = await source.webp(this.target.options).toBuffer();
                break;
            case "image/gif":
                buffer = await source.gif(this.target.options).toBuffer();
                break;
        }

        return { buffer, contentType: this.target.type };
    }

    public toString(): string {
        return "[Convert]";
    }
}
