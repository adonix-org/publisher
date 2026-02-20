import { ImageTask, ImageBuffer } from "..";
import fetch from "node-fetch";
import http from "node:http";

const agent = new http.Agent({ keepAlive: true });

export class Delegate implements ImageTask {
    private readonly url: URL;

    constructor(path: string, port: number = 8120, host: string = "127.0.0.1") {
        this.url = new URL(path, `http://${host}:${port}`);
    }

    public async process(
        image: ImageBuffer,
        signal: AbortSignal,
    ): Promise<ImageBuffer | null> {
        const response = await fetch(this.url, {
            method: "POST",
            body: image.buffer,
            headers: { "Content-Type": image.contentType },
            signal,
            agent,
        });

        if (response.status === 204) {
            return null;
        }

        if (!response.ok) {
            throw new Error(`${response.status} ${await response.text()}`);
        }

        const buffer = Buffer.from(await response.arrayBuffer());
        const contentType =
            response.headers.get("content-type") || "application/octet-stream";

        return { buffer, contentType };
    }

    public toString(): string {
        return `[Delegate: ${this.url}]`;
    }
}
