import { LogError } from "../tasks/error/log";
import { Watermark } from "../tasks/transform/watermark";
import { MaxErrors } from "../tasks/error/max";
import { LocalFile } from "../tasks/transfer/local";
import { Delegate } from "../tasks/transform/delegate";
import { ProfileAgent } from "./profile";
import { Folder } from "../sources/folder";

export class TimeLapse extends ProfileAgent {
    constructor() {
        const camera = new Folder("/Users/tybusby/Desktop/source");

        super(camera);

        this.addImageTask(new Watermark());
        //this.addImageTask(new Delegate("passthrough"));
        this.addImageTask(new Delegate("faces_dnn"));
        this.addImageTask(new Delegate("draw"));
        this.addImageTask(new LocalFile("c121"));

        this.addErrorTask(new LogError());
        this.addErrorTask(new MaxErrors());
    }

    public override toString(): string {
        return `${super.toString()}[TimeLapse]`;
    }
}
