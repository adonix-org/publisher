import { LogError } from "../tasks/error/log";
import { C121 } from "../sources/c121";
import { Watermark } from "../tasks/transform/watermark";
import { Publish } from "../tasks/transfer/publish";
import { MaxSize } from "../tasks/filter/maxsize";
import { Agent } from "./agent";
import { Throttle } from "../tasks/filter/throttle";

export class LiveImage extends Agent {
    constructor() {
        const camera = new C121(1, 60);

        super(camera);

        this.addImageTask(new Throttle(0.2));
        this.addImageTask(new Watermark());
        this.addImageTask(new MaxSize());
        this.addImageTask(new Publish(camera.getName()));

        this.addErrorTask(new LogError());
    }

    public override toString(): string {
        return `${super.toString()}[LiveImage]`;
    }
}
