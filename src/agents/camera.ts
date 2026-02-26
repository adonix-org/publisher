import { C121 } from "../sources/c121";
import { Monitor } from "./monitor";
import { Agent } from "./agent";
import { LiveImage } from "./live";
import { PublisherSession } from "../ws/publisher";
import { Watermark } from "../tasks/transform/watermark";

export class Camera extends Agent {
    constructor() {
        const source = new C121(1, 60);

        const live = new LiveImage(source.getName());
        const websockets = new PublisherSession(live);
        const monitor = new Monitor();

        super(source, websockets, monitor);

        this.addImageTask(new Watermark());
        this.addImageTask(live);
        this.addImageTask(monitor);
    }

    public override toString(): string {
        return `${super.toString()}[Camera]`;
    }
}
