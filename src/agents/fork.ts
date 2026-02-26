import { ImageFrame, ImageTask } from "../tasks";
import { Agent } from "./agent";
import { ImageQueue } from "../sources/queue";

export class AgentFork extends Agent implements ImageTask {
    constructor(private readonly queue: ImageQueue = new ImageQueue()) {
        super(queue);
    }

    public async process(frame: ImageFrame): Promise<ImageFrame | null> {
        this.push(frame);

        return frame;
    }

    protected push(frame: ImageFrame): void {
        this.queue.push(frame);
    }

    public override toString(): string {
        return `${super.toString()}[AgentFork]`;
    }
}
