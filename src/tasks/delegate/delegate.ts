import fetch from "node-fetch";
import http from "node:http";
import { ImageTask, ImageFrame } from "..";
import { assertImageFrame, decode, encode } from "./utils";

const agent = new http.Agent({ keepAlive: true });

export class Delegate implements ImageTask {
    private readonly url: URL;

    constructor(path: string, port: number = 8120, host: string = "127.0.0.1") {
        this.url = new URL(path, `http://${host}:${port}`);
    }

    public async process(
        frame: ImageFrame,
        signal: AbortSignal,
    ): Promise<ImageFrame | null> {
        const response = await fetch(this.url, {
            method: "POST",
            body: JSON.stringify(encode(frame)),
            headers: { "Content-Type": "application/json" },
            signal,
            agent,
        });

        if (response.status === 204) return null;

        if (!response.ok) {
            throw new Error(`${response.status} ${await response.text()}`);
        }

        const result = await response.json();
        assertImageFrame(result);

        return decode(result);
    }

    public toString(): string {
        return `[Delegate: ${this.url}]`;
    }
}
