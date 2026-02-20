export interface Annotation {
    tag: string;
    x: number;
    y: number;
    width: number;
    height: number;
    confidence?: number;
}

export interface ImageBuffer {
    contentType: string;
    buffer: Buffer;
}

type IMAGE_FRAME_SCHEMA_VERSION = 1;

export interface ImageFrame {
    image: ImageBuffer;
    readonly version: IMAGE_FRAME_SCHEMA_VERSION;
    readonly annotations: Annotation[];
}

export interface JsonImageFrame {
    version: IMAGE_FRAME_SCHEMA_VERSION;
    image: {
        contentType: string;
        base64: string;
    };
    annotations: Annotation[];
}

export interface ImageTask {
    process(frame: ImageFrame, signal: AbortSignal): Promise<ImageFrame | null>;

    toString(): string;
}

export interface ImageError {
    error: Error;
    source: string;
    timestamp: number;
}

export interface ErrorTask {
    handle(error: ImageError, signal?: AbortSignal): Promise<void>;

    toString(): string;
}
