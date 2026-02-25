import { ImageFrame } from "../tasks";

export interface ImageSource {
    next(): Promise<ImageFrame | null>;

    toString(): string;
}
