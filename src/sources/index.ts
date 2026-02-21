import { ImageFrame } from "../tasks";

export interface ImageSource {
    next(signal: AbortSignal): Promise<ImageFrame | null>;

    toString(): string;
}
