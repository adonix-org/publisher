import { Workflow } from "../../workflows/workflow";
import { LogError } from "../error/log";
import { ActivityFilter } from "../filter/activity";
import { Remote } from "../remote/remote";
import { MetaData } from "./metadata";
import { Profiler } from "./profiler";

export class Inference extends Workflow {
    public readonly metadata: MetaData = new MetaData();

    constructor() {
        super();

        this.addImageTask(new Profiler(new Remote("mega")));
        this.addImageTask(new ActivityFilter());
        this.addImageTask(new Remote("outline"));
        this.addImageTask(new Remote("label"));
        this.addImageTask(this.metadata);

        this.addErrorTask(new LogError());
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
