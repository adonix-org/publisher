import { ImageBuffer, ImageTask } from "../interfaces";

const POST_URL_BASE = process.env.LIVEIMAGE_BASE;
const ADMIN_KEY = process.env.LIVEIMAGE_ADMIN_KEY;

export class Publisher implements ImageTask {
    constructor(private readonly sourceId: string) {}

    public async process(
        image: ImageBuffer,
        signal: AbortSignal,
    ): Promise<ImageBuffer | null> {
        const response = await fetch(`${POST_URL_BASE}/${this.sourceId}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${ADMIN_KEY}`,
                "Content-Type": image.contentType,
            },
            body: new Uint8Array(image.buffer),
            signal,
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        return image;
    }

    public toString(): string {
        return "[Publisher]";
    }
}
