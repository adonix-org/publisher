import { AgentSource } from ".";
import { Lifecycle } from "../lifecycle";
import { ImageTask } from "../tasks";
import { Profiler } from "../tasks/observe/profiler";
import { Agent } from "./agent";

export class ProfileAgent extends Agent {
    constructor(source: AgentSource, ...children: Lifecycle[]) {
        super(source, ...children);
    }

    public override addImageTask(task: ImageTask): void {
        super.addImageTask(new Profiler(task));
    }
}
