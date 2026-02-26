import path from "node:path";
import { LogError } from "../tasks/error/log";
import { Remote } from "../tasks/remote/remote";
import { ConfidenceFilter } from "../tasks/filter/confidence";
import { Save } from "../tasks/transfer/save";
import { ActivityFilter } from "../tasks/filter/activity";
import { AgentFork } from "./fork";
import { Throttle } from "../tasks/filter/throttle";

export class Monitor extends AgentFork {
    constructor() {
        super();

        const base = process.env.LOCAL_IMAGE_FOLDER!;
        const folder = path.join(base, this.getFolder(), "activity");

        this.addImageTask(new Throttle(1));
        this.addImageTask(new Remote("mega"));
        this.addImageTask(new ConfidenceFilter(0.2));
        this.addImageTask(new ActivityFilter());
        this.addImageTask(new Remote("outline"));
        this.addImageTask(new Remote("label"));
        this.addImageTask(new Save(folder));

        this.addErrorTask(new LogError());
    }

    private getFolder(): string {
        const date = new Date();
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    }

    public override toString(): string {
        return `${super.toString()}[Monitor]`;
    }
}
