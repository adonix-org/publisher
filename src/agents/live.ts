import { LogError } from "../tasks/error/log";
import { C121 } from "../sources/c121";
import { Watermark } from "../tasks/transform/watermark";
import { Publish } from "../tasks/transfer/publish";
import { MaxSize } from "../tasks/filter/maxsize";
import { Agent } from "./agent";

export class LiveImage extends Agent {
    constructor() {
        const camera = new C121(5, 0);

        super(camera);

        this.addImageTask(new Watermark());
        this.addImageTask(new MaxSize());
        this.addImageTask(new Publish(camera.getName()));

        this.addErrorTask(new LogError());
    }

    public override toString(): string {
        return `${super.toString()}[LiveImage]`;
    }
}
