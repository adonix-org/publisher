import { ImageBuffer } from "../tasks";

export interface ImageSource {
    next(signal: AbortSignal): Promise<ImageBuffer | null>;
}
