import { Source } from "../interfaces";
import { TaskAgent } from "./agent";
import { RtspSource } from "./rtsp";
import { LogError } from "./errors";
import { Publisher } from "./publisher";

export class RtspAgent extends TaskAgent {
    constructor(source: Source) {
        super(new RtspSource(source));

        this.addImageTask(new Publisher(source.id));

        this.addErrorTask(new LogError());
    }

    public override toString(): string {
        return `${super.toString()}[RtspAgent]`;
    }
}
