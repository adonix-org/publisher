import path from "node:path";
import { Remote } from "../tasks/remote/remote";
import { ConfidenceFilter } from "../tasks/filter/confidence";
import { Workflow } from "./workflow";
import { Throttle } from "../tasks/filter/throttle";
import { ExportSubject } from "./export";

export class Monitor extends Workflow {
    constructor() {
        super();

        const base = process.env.LOCAL_IMAGE_FOLDER!;
        const folder = path.join(base, this.getFolder(), "activity");

        const animal = new ExportSubject(folder, "animal", 0.55);
        const person = new ExportSubject(folder, "person", 0.55);
        const vehicle = new ExportSubject(folder, "vehicle", 0.667);

        this.register(animal);
        this.register(person);
        this.register(vehicle);

        this.addTask(new Throttle(1));
        this.addTask(new Remote("mega"));
        this.addTask(new ConfidenceFilter(0.4));
        this.addTask(animal);
        this.addTask(person);
        this.addTask(vehicle);
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
