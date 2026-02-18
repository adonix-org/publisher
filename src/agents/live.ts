import { Agent } from "./agent";
import { LogError } from "../tasks/error/log";
import { C121 } from "../sources/c121";
import { Watermark } from "../tasks/transform/watermark";
import { MaxErrors } from "../tasks/error/max";
import { Profiler } from "../tasks/profile/profiler";
import { Publish } from "../tasks/transfer/publish";

export class LiveImage extends Agent {
    constructor() {
        const camera = new C121();

        super(camera);

        this.addImageTask(new Profiler(new Watermark()));
        this.addImageTask(new Profiler(new Publish(camera.getName())));

        this.addErrorTask(new LogError());
        this.addErrorTask(new MaxErrors());
    }

    public override toString(): string {
        return `${super.toString()}[LiveImage]`;
    }
}
