import { Agent } from "./agent";
import { LogError } from "./tasks/error/log";
import { Publish } from "./tasks/image/publish";
import { C121 } from "./sources/c121";
import { Watermark } from "./tasks/image/watermark";
import { MaxErrors } from "./tasks/error/max";
import { Profiler } from "./tasks/image/profiler";

const POST_URL_BASE = process.env.LIVEIMAGE_BASE!;
const BEARER_TOKEN = process.env.LIVEIMAGE_ADMIN_TOKEN!;

export class LiveImage extends Agent {
    constructor() {
        const camera = new C121();

        super(camera);

        this.addImageTask(new Profiler(new Watermark()));

        const url = new URL(`live/${camera.getName()}`, POST_URL_BASE);
        console.info(url);
        this.addImageTask(new Profiler(new Publish(url, BEARER_TOKEN)));

        this.addErrorTask(new LogError());
        this.addErrorTask(new MaxErrors());
    }

    public override toString(): string {
        return `${super.toString()}[LiveImage]`;
    }
}
