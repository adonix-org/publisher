export interface ImageBuffer {
    contentType: string;
    buffer: Buffer;
}

export interface ImageTask {
    process(
        image: ImageBuffer,
        signal: AbortSignal,
    ): Promise<ImageBuffer | null>;
}

export interface ImageError {
    error: Error;
    source: string;
    timestamp: number;
}

export interface ErrorTask {
    handle(error: ImageError, signal?: AbortSignal): Promise<void>;
}
