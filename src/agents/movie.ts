import path from "node:path";
import { Lifecycle } from "../lifecycle";
import { LogError } from "../tasks/error/log";
import { Remote } from "../tasks/remote/remote";
import { FileSource } from "../sources/file";
import { MetaData, MetaFrame } from "../tasks/observe/metadata";
import { Save } from "../tasks/transfer/save";
import { Agent } from "./agent";
import { Profiler } from "../tasks/observe/profiler";
import { ActivityFilter } from "../tasks/filter/activity";

interface MovieMetaData {
    filepath: string;
    metadata: MetaFrame[];
}

export class Movie extends Agent {
    private readonly metadata = new MetaData();
    private readonly filepath: string;

    constructor(private readonly application: Lifecycle) {
        const folder = process.env.LOCAL_IMAGE_FOLDER!;
        const file = path.join(folder, "movies", "deer.mp4");
        const source = new FileSource(file, 1);

        super(source);
        this.filepath = file;

        this.addImageTask(new Profiler(new Remote("mega")));
        this.addImageTask(new ActivityFilter());
        this.addImageTask(new Remote("outline?color=blue"));
        this.addImageTask(new Remote("label"));
        this.addImageTask(this.metadata);
        this.addImageTask(new Save(path.join(folder, "movies", "mega")));

        this.addErrorTask(new LogError());
    }

    protected override async onstart(): Promise<void> {
        await super.onstart();

        console.info("start");
    }

    protected override async oncomplete(): Promise<void> {
        console.info("complete");

        const movieData: MovieMetaData = {
            filepath: this.filepath,
            metadata: this.metadata.getData(),
        };

        console.info(movieData.filepath, `${movieData.metadata.length} frames`);

        this.application.stop();
    }

    public override toString(): string {
        return `${super.toString()}[Movie]`;
    }
}
