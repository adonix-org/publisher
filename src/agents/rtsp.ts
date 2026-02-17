import { Source } from "../interfaces";
import { Agent } from "./agent";
import { RtspSource } from "./sources/rtsp";
import { LogError } from "./errors/log";
import { Publisher } from "./tasks/publisher";

export class RtspAgent extends Agent {
    constructor(source: Source) {
        super(new RtspSource(source));

        this.addImageTask(new Publisher(source.id));

        this.addErrorTask(new LogError());
    }

    public override toString(): string {
        return `${super.toString()}[RtspAgent]`;
    }
}
