import sharp from "sharp";
import { ImageFrame } from "..";
import { ForkAgent } from "../../agents/fork";
import { LogError } from "../error/log";
import { Save } from "../transfer/save";
import { Delegate } from "../delegate/delegate";

export class ExtractFaces extends ForkAgent {
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
            const { label, x, y, width, height } = annotation;
            if (label !== "face") continue;
            if (width < 5 || height < 5) continue;

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

        return frame;
    }

    public override toString(): string {
        return `${super.toString()}[FacesTask]`;
    }
}
