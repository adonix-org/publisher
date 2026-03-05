import { C121 } from "../sources/c121";
import { Monitor } from "../workflows/monitor";
import { Agent } from "./agent";
import { LiveImage } from "../workflows/live";
import { PublisherSession } from "../ws/publisher";
import { PyServer } from "../spawn/pyserver";
import { ViewerTask } from "../tasks/observe/viewer";

export class MonitorLive extends Agent {
    constructor() {
        const source = new C121(15);
        const live = new LiveImage(source.getName());
        const session = new PublisherSession(live);
        const monitor = new Monitor();
        const viewer = new ViewerTask();

        super(source);
        this.register(new PyServer());
        this.register(session);
        this.register(monitor);
        this.register(viewer);

        this.addTask(viewer);
        this.addTask(live);
        this.addTask(monitor);
    }

    public override toString(): string {
        return `${super.toString()}[MonitorLive]`;
    }
}
