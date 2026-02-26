import path from "node:path";
import { Save } from "../tasks/transfer/save";
import { ActivityFilter } from "../tasks/filter/activity";
import { Workflow } from "./workflow";
import { SubjectFilter } from "../tasks/filter/subject";
import { RequiredFilter } from "../tasks/filter/requried";
import { Remote } from "../tasks/remote/remote";
import { Watermark } from "../tasks/transform/watermark";

export class ExportSubject extends Workflow {
    constructor(folder: string, label: string, threshold: number = 0) {
        super();

        const target = path.join(folder, label);

        this.addTask(new RequiredFilter(label));
        this.addTask(new SubjectFilter(label, threshold));
        this.addTask(new ActivityFilter());
        this.addTask(new Watermark("ActiveImage"));
        this.addTask(new Remote("outline"));
        this.addTask(new Remote("label"));
        this.addTask(new Save(target));
    }

    public override toString(): string {
        return `${super.toString()}[ExportSubject]`;
    }
}
