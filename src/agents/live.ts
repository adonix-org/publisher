import { LogError } from "../tasks/error/log";
import { C121 } from "../sources/c121";
import { Watermark } from "../tasks/transform/watermark";
import { Publish } from "../tasks/transfer/publish";
import { MaxSize } from "../tasks/filter/maxsize";
import { ProfileAgent } from "./profile";
import { Delegate } from "../tasks/delegate/delegate";
import { Confidence } from "../tasks/filter/confidence";
import { Detect } from "../tasks/transfer/detect";

export class LiveImage extends ProfileAgent {
    constructor() {
        const camera = new C121(10);

        super(camera);

        this.addImageTask(new Watermark());
        this.addImageTask(new Delegate("yolo"));
        this.addImageTask(new Confidence(0.29));
        this.addImageTask(new Delegate("outline"));
        this.addImageTask(new Delegate("label"));
        this.addImageTask(new Detect("/Users/tybusby/Desktop/yolo/detect"));
        this.addImageTask(new MaxSize());
        this.addImageTask(new Publish(camera.getName()));

        this.addErrorTask(new LogError());
    }

    public override toString(): string {
        return `${super.toString()}[LiveImage]`;
    }
}
