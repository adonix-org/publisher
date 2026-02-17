import { Source } from "../interfaces";
import { TaskAgent } from "./tasks";
import { RtspSource } from "./rtsp";

export class RtspAgent extends TaskAgent {
    constructor(source: Source) {
        super(new RtspSource(source));
    }

    public override toString(): string {
        return `${super.toString()}[RtspAgent]`;
    }
}
