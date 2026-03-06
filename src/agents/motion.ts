import { C121 } from "../sources/c121";
import { Agent } from "./agent";
import { Remote } from "../tasks/remote/remote";
import { PyServer } from "../spawn/pyserver";
import { ViewerTask } from "../tasks/observe/viewer";
import { Label } from "../tasks/transform/label";
import { Trail } from "../tasks/transform/trail";
import { Watermark } from "../tasks/transform/watermark";
import { Drawing } from "../tasks/transform";

export class Motion extends Agent {
    constructor() {
        const camera = new C121(6);
        const viewer = new ViewerTask("LiveMotion");

        super(camera);

        this.register(new PyServer());
        this.register(viewer);

        const drawing = new Drawing(
            new Label(),
            new Trail(),
            new Watermark("LiveMotion"),
        );

        this.addTask(new Remote("mega"));
        this.addTask(drawing);
        this.addTask(viewer);
    }

    public override toString(): string {
        return `${super.toString()}[Motion]`;
    }
}
