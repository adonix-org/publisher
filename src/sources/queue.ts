import { ImageFrame } from "../tasks";
import { Lifecycle } from "../lifecycle";
import { ImageSource } from ".";

export class FrameQueue extends Lifecycle implements ImageSource {
    private readonly frames: ImageFrame[] = [];
    private waiting: ((frame: ImageFrame | null) => void) | null = null;

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
        if (this.running) {
            console.warn(this.toString(), `ignored frame after close`);
            return;
        }

        if (this.waiting) {
            const resolve = this.waiting;
            this.waiting = null;
            resolve(frame);
        } else {
            this.frames.push(frame);
        }
    }

    public override toString(): string {
        return `${super.toString()}[FrameQueue]`;
    }
}
