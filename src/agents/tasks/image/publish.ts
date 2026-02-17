import { ImageBuffer, ImageTask } from "../../interfaces";

const POST_URL_BASE = process.env.LIVEIMAGE_BASE;
const BEARER_TOKEN = process.env.LIVEIMAGE_ADMIN_TOKEN;

export class Publish implements ImageTask {
    constructor(private readonly endpoint: string) {}

    public async process(
        image: ImageBuffer,
        signal: AbortSignal,
    ): Promise<ImageBuffer | null> {
        const response = await fetch(`${POST_URL_BASE}/${this.endpoint}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
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
        return "[Publish]";
    }
}
