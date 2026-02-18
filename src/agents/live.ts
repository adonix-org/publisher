import { Agent } from "./agent";
import { LogError } from "./tasks/error/log";
import { Post } from "./tasks/image/post";
import { C121 } from "./sources/c121";
import { Watermark } from "./tasks/image/watermark";
import { MaxErrors } from "./tasks/error/max";
import { Profiler } from "./tasks/image/profiler";

export class LiveImage extends Agent {
    constructor() {
        const camera = new C121();

        super(camera);

        this.addImageTask(new Profiler(new Watermark()));
        this.addImageTask(new Profiler(new Publish(camera.getName())));

        this.addErrorTask(new LogError());
        this.addErrorTask(new MaxErrors());
    }

    public override toString(): string {
        return `${super.toString()}[LiveImage]`;
    }
}

class Publish extends Post {
    constructor(name: string) {
        const POST_URL_BASE = process.env.LIVEIMAGE_BASE!;
        const BEARER_TOKEN = process.env.LIVEIMAGE_ADMIN_TOKEN!;

        const url = new URL(`live/${name}`, POST_URL_BASE);
        const headers = new Headers({
            Authorization: `Bearer ${BEARER_TOKEN}`,
        });
        super(url, headers);
    }

    public override toString(): string {
        return `${super.toString()}[Publish]`;
    }
}
