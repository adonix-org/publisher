import { Publish } from "../tasks/transfer/publish";
import { MaxSize } from "../tasks/filter/maxsize";
import { Throttle } from "../tasks/filter/throttle";
import { Workflow } from "./workflow";
import { Watermark } from "../tasks/draw/watermark";
import { Drawing } from "../tasks/draw";

export class LiveImage extends Workflow {
    constructor(name: string) {
        super();

        this.addTask(new Throttle(0.2));
        this.addTask(new MaxSize());
        this.addTask(new Drawing(new Watermark("ActiveImage")));
        this.addTask(new Publish(name));
    }

    public override toString(): string {
        return `${super.toString()}[LiveImage]`;
    }
}
