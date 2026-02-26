import { Workflow } from "../../workflows/workflow";
import { ActivityFilter } from "../filter/activity";
import { Remote } from "../remote/remote";
import { MetaData } from "./metadata";
import { Profiler } from "./profiler";

export class Inference extends Workflow {
    public readonly metadata: MetaData = new MetaData();

    constructor() {
        super();

        this.addTask(new Profiler(new Remote("mega")));
        this.addTask(new ActivityFilter());
        this.addTask(new Remote("outline"));
        this.addTask(new Remote("label"));
        this.addTask(this.metadata);
    }

    protected override async oncomplete(): Promise<void> {
        await super.oncomplete();

        console.info(this.toString(), "completed");
    }

    protected override async onabort(): Promise<void> {
        await super.onabort();

        console.warn(this.toString(), "killed");
    }

    public override toString(): string {
        return `${super.toString()}[Inference]`;
    }
}
