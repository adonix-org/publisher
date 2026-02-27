import path from "node:path";
import { C121 } from "../sources/c121";
import { Movie } from "../targets/movie";
import { Agent } from "./agent";
import { Preview } from "../targets/preview";
import { Watermark } from "../tasks/transform/watermark";

export class Motion extends Agent {
    constructor() {
        const fps = 5;
        const source = new C121(fps, 60);

        super(source);

        const base = process.env.LOCAL_IMAGE_FOLDER!;

        const file = path.join(base, this.getFolder(), "movies", "live.mp4");
        const preview1 = new Preview();
        const preview2 = new Preview();
        const movie = new Movie(fps, file);

        this.register(preview1);
        this.register(preview2);
        this.register(movie);

        this.addTask(preview1);
        this.addTask(new Watermark("LiveMotion"));
        this.addTask(preview2);
        this.addTask(movie);
    }

    private getFolder(): string {
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
