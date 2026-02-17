import { Agent } from "./agent";
import { LogError } from "./errors/log";
import { Publish } from "./tasks/publish";
import { C121 } from "./sources/c121";
import { Watermark } from "./tasks/watermark";
import { Convert } from "./tasks/convert";

export class LiveImage extends Agent {
    private readonly camera = new C121();

    constructor() {
        super(new C121());
        
        this.addImageTask(new Watermark());
        this.addImageTask(
            new Convert({ type: "image/jpeg", options: { quality: 70 } }),
        );
        this.addImageTask(new Publish(this.camera.getID()));

        this.addErrorTask(new LogError());
    }

    public override toString(): string {
        return `${super.toString()}[LiveImage]`;
    }
}
