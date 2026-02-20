import { ImageSource } from "../sources";
import { ImageTask } from "../tasks";
import { Profiler } from "../tasks/observe/profiler";
import { Agent } from "./agent";

export class ProfileAgent extends Agent {
    constructor(
        source: ImageSource,
        private readonly profile: boolean = true,
    ) {
        super(source);
    }

    public override addImageTask(task: ImageTask): void {
        if (this.profile) {
            super.addImageTask(new Profiler(task));
            return;
        }

        super.addImageTask(task);
    }
}
