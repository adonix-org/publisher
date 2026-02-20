import { ImageBuffer, ImageTask } from "..";

type MaxSizeMode = "drop" | "error";

export class MaxSize implements ImageTask {
    private static readonly DEFAULT_MAX_SIZE = 1_900_000;

    constructor(
        private readonly maxSize = MaxSize.DEFAULT_MAX_SIZE,
        private readonly mode: MaxSizeMode = "error",
    ) {}

    public async process(image: ImageBuffer): Promise<ImageBuffer | null> {
        const size = image.buffer.byteLength;
        if (size <= this.maxSize) {
            return image;
        }

        const msg = `[MaxSize] image size ${Math.round(size / 1024)} K exceeds maximum ${Math.round(this.maxSize / 1024)} K`;

        if (this.mode === "drop") {
            console.warn(`${msg} — dropping frame`);
            return null;
        } else {
            throw new Error(msg);
        }
    }

    public toString(): string {
        return "[MaxSize]";
    }
}
