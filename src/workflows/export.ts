import { SaveImage } from "../tasks/transfer/save";
import { Workflow } from "./workflow";
import { RequiredFilter } from "../tasks/filter/requried";
import { Watermark } from "../tasks/transform/watermark";
import { ConfidenceFilter } from "../tasks/filter/confidence";
import { CategoryPath } from "../paths/category";
import { Label } from "../tasks/transform/label";

export class ExportSubject extends Workflow {
    constructor(
        folder: string,
        private readonly label: string,
        threshold: number = 0,
    ) {
        super();

        const target = new CategoryPath(folder, label, label);

        this.addTask(new ConfidenceFilter(threshold, label));
        this.addTask(new RequiredFilter(label));
        this.addTask(new Label());
        this.addTask(new Watermark("ActiveImage"));
        this.addTask(new SaveImage(target));
    }

    public override toString(): string {
        return `${super.toString()}[ExportSubject-${this.label}]`;
    }
}
