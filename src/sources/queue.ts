import { ImageFrame } from "../tasks";
import { Lifecycle } from "../lifecycle";
import { ImageSource } from ".";

export class ImageQueue extends Lifecycle implements ImageSource {
    private readonly frames: ImageFrame[] = [];
    private waiting: ((frame: ImageFrame | null) => void) | null = null;

    private readonly intervalId?: NodeJS.Timeout;
    private dropped = 0;

    private report(): void {
        if (this.dropped === 0) return;

        console.warn(this.toString(), `${this.dropped} dropped frames`);
        this.dropped = 0;
    }

    constructor(private readonly bufferSize = Infinity) {
        super();

        if (this.bufferSize === Infinity) return;

        this.intervalId = setInterval(() => this.report(), 5000);
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

        clearInterval(this.intervalId);

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

        if (this.frames.length >= this.bufferSize) {
            this.frames.shift();
            this.dropped++;
        }

        this.frames.push(frame);
    }

    public clear(): void {
        this.frames.length = 0;
    }

    public override toString(): string {
        return `${super.toString()}[ImageQueue]`;
    }
}
