import { AgentSource } from ".";
import { ImageTask } from "../tasks";
import { Profiler } from "../tasks/observe/profiler";
import { Agent } from "./agent";

export class ProfileAgent extends Agent {
    constructor(source: AgentSource) {
        super(source);
    }

    public override addImageTask(task: ImageTask): void {
        super.addImageTask(new Profiler(task));
    }
}
