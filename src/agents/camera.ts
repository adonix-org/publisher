import { C121 } from "../sources/c121";
import { Monitor } from "../workflows/monitor";
import { Agent } from "./agent";
import { LiveImage } from "../workflows/live";
import { PublisherSession } from "../ws/publisher";

export class Camera extends Agent {
    constructor() {
        const source = new C121(1, 60);

        const live = new LiveImage(source.getName());
        const session = new PublisherSession(live);
        const monitor = new Monitor();

        super(source, session, monitor);

        this.addImageTask(live);
        this.addImageTask(monitor);
    }

    public override toString(): string {
        return `${super.toString()}[Camera]`;
    }
}
