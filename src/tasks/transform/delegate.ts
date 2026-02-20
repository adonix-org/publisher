import { ImageTask, ImageFrame, Base64 } from "..";
import fetch from "node-fetch";
import http from "node:http";

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

export function decode(frame: ImageFrame<Base64>): ImageFrame {
    return {
        ...frame,
        image: {
            buffer: Buffer.from(frame.image.buffer, "base64"),
            contentType: frame.image.contentType,
        },
    };
}

function encode(frame: ImageFrame): ImageFrame<Base64> {
    return {
        ...frame,
        image: {
            contentType: frame.image.contentType,
            buffer: frame.image.buffer.toString("base64"),
        },
    };
}

function assertImageFrame(value: unknown): asserts value is ImageFrame<Base64> {
    if (typeof value !== "object" || value === null) {
        throw new Error("Invalid JSON response: not an object");
    }

    const obj = value as Record<string, unknown>;

    if (
        typeof obj.version !== "number" ||
        typeof obj.image !== "object" ||
        obj.image === null
    ) {
        throw new Error("Invalid JSON response: missing image or version");
    }

    const img = obj.image as Record<string, unknown>;

    if (
        typeof img.buffer !== "string" ||
        typeof img.contentType !== "string" ||
        !Array.isArray(obj.annotations)
    ) {
        throw new Error("Invalid JSON response: bad image or annotations");
    }
}
