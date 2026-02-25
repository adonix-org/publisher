import { LogError } from "../tasks/error/log";
import { C121 } from "../sources/c121";
import { Watermark } from "../tasks/transform/watermark";
import { ProfileAgent } from "./profile";
import { Remote } from "../tasks/remote/remote";
import { ConfidenceFilter } from "../tasks/filter/confidence";
import { SubjectFilter } from "../tasks/filter/subject";
import { ActivityFilter } from "../tasks/filter/activity";
import { Save } from "../tasks/transfer/save";
import path from "node:path";

export class Watchdog extends ProfileAgent {
    constructor() {
        const folder = process.env.LOCAL_IMAGE_FOLDER!;
        const camera = new C121(5);
        super(camera);

        this.addImageTask(new Remote("mega"));
        this.addImageTask(new ConfidenceFilter(0.3));
        this.addImageTask(new SubjectFilter("person", 0.4));
        this.addImageTask(new SubjectFilter("animal", 0.5));
        this.addImageTask(new SubjectFilter("vehicle", 0.5));
        this.addImageTask(new ActivityFilter());
        this.addImageTask(new Watermark());
        this.addImageTask(new Remote("outline"));
        this.addImageTask(new Remote("label"));
        this.addImageTask(new Save(path.join(folder, "watchdog", "activity")));

        this.addErrorTask(new LogError());
    }

    public override toString(): string {
        return `${super.toString()}[Watchdog]`;
    }
}
