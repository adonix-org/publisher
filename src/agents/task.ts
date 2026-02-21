import sharp from "sharp";
import { ImageFrame, ImageTask } from "../tasks";
import { Agent } from "./agent";
import { FrameQueue } from "../sources/queue";
import { LogError } from "../tasks/error/log";
import { Save } from "../tasks/transfer/save";
import { Delegate } from "../tasks/delegate/delegate";

export abstract class AgentTask extends Agent implements ImageTask {
    private readonly frames: FrameQueue;

    constructor() {
        const queue = new FrameQueue();
        super(queue);
        this.frames = queue;
    }

    public abstract process(
        frame: ImageFrame,
        signal: AbortSignal,
    ): Promise<ImageFrame | null>;

    protected push(frame: ImageFrame): void {
        this.frames.push(frame);
    }

    public override toString(): string {
        return `${super.toString()}[AgentTask]`;
    }
}

export class FacesTask extends AgentTask {
    constructor() {
        super();

        this.addImageTask(new Delegate("grayscale"));
        this.addImageTask(
            new Save("/Users/tybusby/Desktop/faces/extracted", "face"),
        );

        this.addErrorTask(new LogError());
    }

    public override async process(frame: ImageFrame): Promise<ImageFrame> {
        const image = sharp(frame.image.buffer); // load once

        for (const annotation of frame.annotations) {
            if (annotation.label === "face") {
                const { x, y, width, height } = annotation;

                const face = await image
                    .clone()
                    .extract({ left: x, top: y, width, height })
                    .jpeg()
                    .toBuffer();

                this.push({
                    ...frame,
                    image: {
                        buffer: face,
                        contentType: "image/jpeg",
                    },
                });
            }
        }

        return frame;
    }

    public override toString(): string {
        return `${super.toString()}[FacesTask]`;
    }
}
