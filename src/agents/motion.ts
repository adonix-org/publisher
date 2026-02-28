import { C121 } from "../sources/c121";
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

        // const base = process.env.LOCAL_IMAGE_FOLDER!;

        const preview = new Preview();

        this.register(preview);

        this.addTask(new Timer(new Remote("yolo"), 60_000));
        this.addTask(new Timer(new Remote("passthrough")));
        this.addTask(new ConfidenceFilter(0.4));
        this.addTask(new Remote("outline"));
        this.addTask(new Remote("label"));
        this.addTask(preview);
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
