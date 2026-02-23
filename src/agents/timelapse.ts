import { LogError } from "../tasks/error/log";
import { Watermark } from "../tasks/transform/watermark";
import { MaxErrors } from "../tasks/error/max";
import { Remote } from "../tasks/remote/remote";
import { ProfileAgent } from "./profile";
import { SourceFolder } from "../sources/folder";
import { ConfidenceFilter } from "../tasks/filter/confidence";
import { Save } from "../tasks/transfer/save";
import path from "node:path";

export class TimeLapse extends ProfileAgent {
    constructor() {
        const folder = process.env.LOCAL_IMAGE_FOLDER!;
        const source = new SourceFolder(path.join(folder, "source"));

        super(source);

        this.addImageTask(new Remote("yolo"));
        this.addImageTask(new ConfidenceFilter(0.4));
        this.addImageTask(new Remote("outline"));
        this.addImageTask(new Remote("label"));
        this.addImageTask(new Watermark());
        this.addImageTask(new Save(path.join(folder, "timelapse")));

        this.addErrorTask(new LogError());
        this.addErrorTask(new MaxErrors());
    }

    protected override async oncomplete(): Promise<void> {
        this.stop();
    }

    public override toString(): string {
        return `${super.toString()}[TimeLapse]`;
    }
}
