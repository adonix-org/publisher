import path from "node:path";
import { C121 } from "../sources/c121";
import { Record } from "../targets/record";
import { Agent } from "./agent";
import { Preview } from "../targets/preview";
import { Remote } from "../tasks/remote/remote";
import { ConfidenceFilter } from "../tasks/filter/confidence";
import { Timer } from "../tasks/observe/timer";

export class Motion extends Agent {
    constructor() {
        const fps = 10;

        const source = new C121(fps, 60);

        super(source);

        const base = process.env.LOCAL_IMAGE_FOLDER!;

        const file = path.join(base, this.getFolder(), "movies", "live.mp4");
        const preview = new Preview();
        const record = new Record(fps, file);

        this.register(preview);
        this.register(record);

        this.addTask(new Timer(new Remote("yolo"), 60_000));
        this.addTask(new Timer(new Remote("passthrough")));
        this.addTask(new ConfidenceFilter(0.4));
        this.addTask(new Remote("outline"));
        this.addTask(new Remote("label"));
        this.addTask(preview);
        this.addTask(record);
    }

    protected getFolder(): string {
        const date = new Date();
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    }

    public override toString(): string {
        return `${super.toString()}[Motion]`;
    }
}
