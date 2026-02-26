import { LogError } from "../tasks/error/log";
import { Publish } from "../tasks/transfer/publish";
import { MaxSize } from "../tasks/filter/maxsize";
import { Throttle } from "../tasks/filter/throttle";
import { AgentFork } from "./fork";

export class LiveImage extends AgentFork {
    constructor(name: string) {
        super();

        this.addImageTask(new Throttle(0.2));
        this.addImageTask(new MaxSize());
        this.addImageTask(new Publish(name));

        this.addErrorTask(new LogError());
    }

    public override toString(): string {
        return `${super.toString()}[LiveImage]`;
    }
}
