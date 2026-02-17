import { Agent } from "./agent";
import { LogError } from "./errors/log";
import { Publisher } from "./tasks/publisher";
import { C121 } from "./sources/c121";

export class LiveImage extends Agent {
    private readonly camera = new C121();

    constructor() {
        super(new C121());

        this.addImageTask(new Publisher(this.camera.getID()));

        this.addErrorTask(new LogError());
    }

    public override toString(): string {
        return `${super.toString()}[CameraAgent]`;
    }
}
