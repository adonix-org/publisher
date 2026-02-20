import { ImageFrame } from "../tasks";

export const IMAGE_FRAME_VERSION = 0;

export interface ImageSource {
    next(signal: AbortSignal): Promise<ImageFrame | null>;

    toString(): string;
}
