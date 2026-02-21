type IMAGE_FRAME_SCHEMA_VERSION = 1;

export type Base64 = string;

export interface Annotation {
    label: string;
    x: number;
    y: number;
    width: number;
    height: number;
    confidence?: number;
}

export interface ImageBuffer<T extends Buffer | Base64 = Buffer> {
    contentType: string;
    buffer: T;
}

export interface ImageFrame<T extends Buffer | Base64 = Buffer> {
    image: ImageBuffer<T>;
    readonly version: IMAGE_FRAME_SCHEMA_VERSION;
    readonly annotations: Annotation[];
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
