import { ImageSource } from ".";
import { Lifecycle } from "../lifecycle";
import { ImageFrame } from "../tasks";

export class ImageList extends Lifecycle implements ImageSource {
    private readonly list: ImageFrame[] = [];

    public async next(): Promise<ImageFrame | null> {
        return this.list.shift() ?? null;
    }

    public push(frame: ImageFrame): void {
        this.list.push(frame);
    }

    public override toString(): string {
        return `${super.toString()}[ImageList]`;
    }
}
