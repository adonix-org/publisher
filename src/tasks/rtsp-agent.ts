import { Source } from "../interfaces";
import { TaskAgent } from "./tasks";
import { RtspSource } from "./rtsp";
import { LogError } from "./errors";

export class RtspAgent extends TaskAgent {
    constructor(source: Source) {
        super(new RtspSource(source));
        
        this.addErrorTask(new LogError());
    }

    public override toString(): string {
        return `${super.toString()}[RtspAgent]`;
    }
}
