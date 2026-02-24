import { LogError } from "../tasks/error/log";
import { Watermark } from "../tasks/transform/watermark";
import { Remote } from "../tasks/remote/remote";
import { ProfileAgent } from "./profile";
import { ConfidenceFilter } from "../tasks/filter/confidence";
import { Save } from "../tasks/transfer/save";
import path from "node:path";
import { Lifecycle } from "../lifecycle";
import { C121 } from "../sources/c121";
import { ActivityFilter } from "../tasks/filter/activity";

export class TimeLapse extends ProfileAgent {
    constructor(private readonly application: Lifecycle) {
        const folder = process.env.LOCAL_IMAGE_FOLDER!;
        const source = new C121(10);

        super(source);

        this.addImageTask(new Watermark());
        this.addImageTask(new Save(path.join(folder, this.getFolder())));
        this.addImageTask(new Remote("yolo"));
        this.addImageTask(new ActivityFilter());
        this.addImageTask(new ConfidenceFilter(0.4));
        this.addImageTask(new Remote("outline"));
        this.addImageTask(new Remote("label"));
        this.addImageTask(
            new Save(path.join(folder, this.getFolder(), "activity")),
        );

        this.addErrorTask(new LogError());
    }

    private getFolder(): string {
        const date = new Date();
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    }

    protected override async oncomplete(): Promise<void> {
        this.application.stop();
    }

    public override toString(): string {
        return `${super.toString()}[TimeLapse]`;
    }
}
