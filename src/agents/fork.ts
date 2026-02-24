import { ImageFrame, ImageTask } from "../tasks";
import { Agent } from "./agent";
import { ImageQueue } from "../sources/queue";

export class ForkAgent extends Agent implements ImageTask {
    private readonly frames: ImageQueue;

    constructor() {
        const queue = new ImageQueue();
        super(queue);

        this.frames = queue;
    }

    public async process(frame: ImageFrame): Promise<ImageFrame | null> {
        this.push(frame);

        return frame;
    }

    protected push(frame: ImageFrame): void {
        this.frames.push(frame);
    }

    public override toString(): string {
        return `${super.toString()}[ForkAgent]`;
    }
}
