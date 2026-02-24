import { ImageStream } from "./stream";

export abstract class JpegStream extends ImageStream {
    public static readonly SOI = Buffer.from([0xff, 0xd8]);
    public static readonly EOI = Buffer.from([0xff, 0xd9]);

    protected override get soi(): Buffer<ArrayBufferLike> {
        return JpegStream.SOI;
    }
    protected override get eoi(): Buffer<ArrayBufferLike> {
        return JpegStream.EOI;
    }

    public override toString(): string {
        return `${super.toString()}[JPEG]`;
    }
}

export abstract class GifStream extends ImageStream {
    public static readonly SOI = Buffer.from("GIF89a", "ascii");
    public static readonly EOI = Buffer.from([0x3b]);

    protected override get soi(): Buffer {
        return GifStream.SOI;
    }

    protected override get eoi(): Buffer {
        return GifStream.EOI;
    }

    public override toString(): string {
        return `${super.toString()}[GIF]`;
    }
}

export abstract class PngStream extends ImageStream {
    public static readonly SOI = Buffer.from([
        0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]);
    public static readonly EOI = Buffer.from([
        0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
    ]);

    protected override get soi(): Buffer {
        return PngStream.SOI;
    }

    protected override get eoi(): Buffer {
        return PngStream.EOI;
    }

    public override toString(): string {
        return `${super.toString()}[PNG]`;
    }
}
