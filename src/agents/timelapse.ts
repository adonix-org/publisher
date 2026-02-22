import { LogError } from "../tasks/error/log";
import { Watermark } from "../tasks/transform/watermark";
import { MaxErrors } from "../tasks/error/max";
import { LocalFile } from "../tasks/transfer/local";
import { Remote } from "../tasks/remote/remote";
import { ProfileAgent } from "./profile";
import { SourceFolder } from "../sources/folder";
import { ConfidenceFilter } from "../tasks/filter/confidence";
import { SubjectFilter } from "../tasks/filter/subject";

export class TimeLapse extends ProfileAgent {
    constructor() {
        const folder = new SourceFolder("/Users/tybusby/Desktop/source");
        super(folder);

        this.addImageTask(new Watermark());
        this.addImageTask(new Remote("mega"));
        this.addImageTask(new ConfidenceFilter(0.6));
        this.addImageTask(new SubjectFilter("person"));

        this.addImageTask(new Remote("outline"));
        this.addImageTask(new Remote("label"));
        this.addImageTask(new LocalFile("yolo"));

        this.addErrorTask(new LogError());
        this.addErrorTask(new MaxErrors());
    }

    public override toString(): string {
        return `${super.toString()}[TimeLapse]`;
    }
}
