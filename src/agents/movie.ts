import path from "node:path";
import { FileSource } from "../sources/file";
import { MetaFrame } from "../tasks/observe/metadata";
import { Agent } from "./agent";
import { application } from "../application";
import { Inference } from "../tasks/observe/inference";

export interface MovieMetaData {
    filepath: string;
    metadata: MetaFrame[];
}

export class Movie extends Agent {
    constructor() {
        const folder = process.env.LOCAL_IMAGE_FOLDER!;
        const file = path.join(folder, "movies", "deer.mp4");

        const source = new FileSource(file, 1);
        const fork = new Inference();

        super(source, fork);

        this.addTask(fork);
    }

    protected override async onstart(): Promise<void> {
        await super.onstart();
        console.info("start");
    }

    protected override async oncomplete(): Promise<void> {
        console.info("complete");
        application.stop();
    }

    protected override async onabort(): Promise<void> {
        console.warn(this.toString(), "killed");
    }

    public override toString(): string {
        return `${super.toString()}[Movie]`;
    }
}
