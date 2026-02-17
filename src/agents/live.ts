import { Agent } from "./agent";
import { LogError } from "./errors/log";
import { Publish } from "./tasks/publish";
import { C121 } from "./sources/c121";
import { Watermark } from "./tasks/watermark";
import { MaxErrors } from "./errors/max";

export class LiveImage extends Agent {
    constructor() {
        const camera = new C121();

        super(camera);

        this.addImageTask(new Watermark());
        this.addImageTask(new Publish(camera.getName()));

        this.addErrorTask(new LogError());
        this.addErrorTask(new MaxErrors());
    }

    public override toString(): string {
        return `${super.toString()}[LiveImage]`;
    }
}
