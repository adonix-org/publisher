import path from "path";
import { Lifecycle } from "../lifecycle";
import { LogError } from "../tasks/error/log";
import { ActivityFilter } from "../tasks/filter/activity";
import { ConfidenceFilter } from "../tasks/filter/confidence";
import { Remote } from "../tasks/remote/remote";
import { Save } from "../tasks/transfer/save";
import { ProfileAgent } from "./profile";
import { FileSource } from "../sources/file";

export class Movie extends ProfileAgent {
    constructor(private readonly application: Lifecycle) {
        const folder = process.env.LOCAL_IMAGE_FOLDER!;

        const source = new FileSource(
            path.join(folder, "movies", "deer.mp4"),
            1,
        );

        super(source);

        this.addImageTask(new Save(path.join(folder, "movies", "frames")));
        this.addImageTask(new Remote("mega"));
        this.addImageTask(new ConfidenceFilter(0.6));
        this.addImageTask(new ActivityFilter());
        this.addImageTask(new Remote("outline"));
        this.addImageTask(new Remote("label"));
        this.addImageTask(new Save(path.join(folder, "movies", "activity")));

        this.addErrorTask(new LogError());
    }

    protected override async oncomplete(): Promise<void> {
        this.application.stop();
    }

    public override toString(): string {
        return `${super.toString()}[Movie]`;
    }
}
