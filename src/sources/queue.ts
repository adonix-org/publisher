import { ImageFrame } from "../tasks";
import { Lifecycle } from "../lifecycle";
import { ImageSource } from ".";

export class ImageQueue extends Lifecycle implements ImageSource {
    private readonly frames: ImageFrame[] = [];
    private waiting: ((frame: ImageFrame | null) => void) | null = null;

    constructor(private readonly bufferSize = Infinity) {
        super();
    }

    public async next(): Promise<ImageFrame | null> {
        const frame = this.frames.shift();
        if (frame) return frame;

        if (!this.running) {
            return null;
        }

        return new Promise<ImageFrame | null>((resolve) => {
            this.waiting = resolve;
        });
    }

    public override async onstop(): Promise<void> {
        await super.onstop();

        if (this.waiting) {
            this.waiting(null);
        }
    }

    public push(frame: ImageFrame): void {
        if (this.waiting) {
            const resolve = this.waiting;
            this.waiting = null;
            resolve(frame);
            return;
        }

        this.frames.push(frame);

        if (this.frames.length <= this.bufferSize) {
            return;
        }

        const dropped = this.frames.length - this.bufferSize;
        this.frames.splice(0, dropped);
        console.warn(this.toString(), `dropped ${dropped} frame(s)`);
    }

    public clear(): void {
        this.frames.length = 0;
    }

    public override toString(): string {
        return `${super.toString()}[ImageQueue]`;
    }
}
