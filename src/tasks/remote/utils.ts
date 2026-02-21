import { ImageFrame } from "..";

export function decode(frame: ImageFrame<string>): ImageFrame {
    return {
        ...frame,
        image: {
            buffer: Buffer.from(frame.image.buffer, "base64"),
            contentType: frame.image.contentType,
        },
    };
}

export function encode(frame: ImageFrame): ImageFrame<string> {
    return {
        ...frame,
        image: {
            contentType: frame.image.contentType,
            buffer: frame.image.buffer.toString("base64"),
        },
    };
}

export function assertImageFrame(
    value: unknown,
): asserts value is ImageFrame<string> {
    if (typeof value !== "object" || value === null) {
        throw new TypeError("Invalid JSON response: not an object");
    }

    const obj = value as Record<string, unknown>;
    if (
        typeof obj.version !== "number" ||
        typeof obj.image !== "object" ||
        obj.image === null
    ) {
        throw new TypeError("Invalid JSON response: missing image or version");
    }

    const img = obj.image as Record<string, unknown>;
    if (
        typeof img.buffer !== "string" ||
        typeof img.contentType !== "string" ||
        !Array.isArray(obj.annotations)
    ) {
        throw new TypeError("Invalid JSON response: bad image or annotations");
    }
}
