import { LogError } from "../tasks/error/log";
import { C121 } from "../sources/c121";
import { Watermark } from "../tasks/transform/watermark";
//import { Publish } from "../tasks/transfer/publish";
import { MaxSize } from "../tasks/filter/maxsize";
import { ProfileAgent } from "./profile";
import { Remote } from "../tasks/remote/remote";
import { ConfidenceFilter } from "../tasks/filter/confidence";
import { Detect } from "../tasks/transfer/detect";
import { SubjectFilter } from "../tasks/filter/subject";

export class LiveImage extends ProfileAgent {
    constructor() {
        const camera = new C121(5);

        super(camera);

        this.addImageTask(new Watermark());
        this.addImageTask(new Remote("mega"));
        this.addImageTask(new ConfidenceFilter(0.29));
        this.addImageTask(new SubjectFilter("person", 0.7));
        this.addImageTask(new Remote("outline"));
        this.addImageTask(new Remote("label"));
        this.addImageTask(new Detect("/Users/tybusby/Desktop/yolo/detect"));
        this.addImageTask(new MaxSize());
        //this.addImageTask(new Publish(camera.getName()));

        this.addErrorTask(new LogError());
    }

    public override toString(): string {
        return `${super.toString()}[LiveImage]`;
    }
}
