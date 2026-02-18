import { ImageBuffer, ImageTask } from "../../interfaces";

export class Publish implements ImageTask {
    constructor(
        private readonly url: URL,
        private readonly token: string,
    ) {}

    public async process(
        image: ImageBuffer,
        signal: AbortSignal,
    ): Promise<ImageBuffer | null> {
        const response = await fetch(this.url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.token}`,
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
