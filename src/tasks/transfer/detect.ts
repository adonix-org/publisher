import { ImageFrame } from "..";
import { Save } from "./save";

export class Detect extends Save {
    constructor(folder: string) {
        super(folder, "detected");
    }

    public override async process(
        frame: ImageFrame,
    ): Promise<ImageFrame | null> {
        if (frame.annotations.length === 0) return frame;

        super.process(frame);

        return frame;
    }
}
