import path from "node:path";
import { Watermark } from "../tasks/transform/watermark";
import { Remote } from "../tasks/remote/remote";
import { ConfidenceFilter } from "../tasks/filter/confidence";
import { SubjectFilter } from "../tasks/filter/subject";
import { ActivityFilter } from "../tasks/filter/activity";
import { Save } from "../tasks/transfer/save";
import { Profiler } from "../tasks/observe/profiler";
import { Workflow } from "./workflow";

export class Watchdog extends Workflow {
    constructor() {
        super();

        const folder = process.env.LOCAL_IMAGE_FOLDER!;

        this.addTask(new Profiler(new Remote("mega")));
        this.addTask(new ConfidenceFilter(0.3));
        this.addTask(new SubjectFilter("person", 0.4));
        this.addTask(new SubjectFilter("animal", 0.5));
        this.addTask(new SubjectFilter("vehicle", 0.5));
        this.addTask(new ActivityFilter());
        this.addTask(new Watermark("Watchdog"));
        this.addTask(new Remote("outline"));
        this.addTask(new Remote("label"));
        this.addTask(new Save(path.join(folder, "watchdog", "activity")));
    }

    public override toString(): string {
        return `${super.toString()}[Watchdog]`;
    }
}
