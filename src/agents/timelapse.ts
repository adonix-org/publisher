import { LogError } from "../tasks/error/log";
import { Watermark } from "../tasks/transform/watermark";
import { MaxErrors } from "../tasks/error/max";
import { LocalFile } from "../tasks/transfer/local";
import { Delegate } from "../tasks/delegate/delegate";
import { ProfileAgent } from "./profile";
import { Folder } from "../sources/folder";

export class TimeLapse extends ProfileAgent {
    constructor() {
        const camera = new Folder("/Users/tybusby/Desktop/source");

        super(camera);

        this.addImageTask(new Watermark());
        this.addImageTask(new Delegate("detect_faces"));
        this.addImageTask(new Delegate("outline_faces"));
        this.addImageTask(new LocalFile("faces"));

        this.addErrorTask(new LogError());
        this.addErrorTask(new MaxErrors());
    }

    public override toString(): string {
        return `${super.toString()}[TimeLapse]`;
    }
}
