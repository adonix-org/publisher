import sharp from "sharp";
import { ImageFrame } from "..";
import { Workflow } from "../../workflows/workflow";
import { LogError } from "../error/log";
import { Save } from "../transfer/save";
import { Remote } from "../remote/remote";

export class Extract extends Workflow {
    constructor(folder: string) {
        super();

        this.addImageTask(new Remote("grayscale"));
        this.addImageTask(new Save(folder));

        this.addErrorTask(new LogError());
    }

    public override async process(frame: ImageFrame): Promise<ImageFrame> {
        const image = sharp(frame.image.buffer);

        for (const annotation of frame.annotations) {
            const { x, y, width, height } = annotation;
            if (width < 5 || height < 5) continue;

            const subject = await image
                .clone()
                .extract({ left: x, top: y, width, height })
                .jpeg()
                .toBuffer();

            this.push({
                ...frame,
                image: {
                    buffer: subject,
                    contentType: "image/jpeg",
                },
            });
        }

        return frame;
    }

    public override toString(): string {
        return `${super.toString()}[Extract]`;
    }
}
