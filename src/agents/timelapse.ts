import { Agent } from "./agent";
import { LogError } from "../tasks/error/log";
import { C121 } from "../sources/c121";
import { Watermark } from "../tasks/transform/watermark";
import { MaxErrors } from "../tasks/error/max";
import { LocalFile } from "../tasks/transfer/local";

export class TimeLapse extends Agent {
    constructor() {
        const camera = new C121(10);

        super(camera);

        this.addImageTask(new Watermark());
        this.addImageTask(new LocalFile(camera.getName()));

        this.addErrorTask(new LogError());
        this.addErrorTask(new MaxErrors());
    }

    public override toString(): string {
        return `${super.toString()}[LiveImage]`;
    }
}
