import { LogError } from "../tasks/error/log";
import { Watermark } from "../tasks/transform/watermark";
import { MaxErrors } from "../tasks/error/max";
import { LocalFile } from "../tasks/transfer/local";
import { Delegate } from "../tasks/delegate/delegate";
import { ProfileAgent } from "./profile";
import { SourceFolder } from "../sources/folder";
import { Confidence } from "../tasks/filter/confidence";

export class TimeLapse extends ProfileAgent {
    constructor() {
        const folder = new SourceFolder("/Users/tybusby/Desktop/source");
        super(folder);

        this.addImageTask(new Watermark());
        this.addImageTask(new Delegate("yolo"));
        this.addImageTask(new Confidence(0.2));

        this.addImageTask(new Delegate("outline"));
        this.addImageTask(new LocalFile("yolo"));

        this.addErrorTask(new LogError());
        this.addErrorTask(new MaxErrors());
    }

    public override toString(): string {
        return `${super.toString()}[TimeLapse]`;
    }
}
