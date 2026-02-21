import sharp from "sharp";
import { ImageFrame } from "..";
import { TaskAgent } from "../../agents/task";
import { LogError } from "../error/log";
import { Save } from "../transfer/save";
import { Delegate } from "./delegate";

export class ExtractFaces extends TaskAgent {
    constructor() {
        super();

        this.addImageTask(new Delegate("grayscale"));
        this.addImageTask(
            new Save("/Users/tybusby/Desktop/faces/extracted", "face"),
        );

        this.addErrorTask(new LogError());
    }

    public override async process(frame: ImageFrame): Promise<ImageFrame> {
        const image = sharp(frame.image.buffer);

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
