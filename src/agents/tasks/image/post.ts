import { ImageBuffer, ImageTask } from "../../interfaces";

export class Post implements ImageTask {
    constructor(
        private readonly url: URL,
        private readonly headers: Headers,
    ) {}

    public async process(
        image: ImageBuffer,
        signal: AbortSignal,
    ): Promise<ImageBuffer | null> {
        const headers = new Headers(this.headers);
        headers.set("Content-Type", image.contentType);

        const response = await fetch(this.url, {
            method: "POST",
            headers,
            body: new Uint8Array(image.buffer),
            signal,
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        return image;
    }

    public toString(): string {
        return "[Post]";
    }
}
