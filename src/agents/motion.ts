import { Agent } from "./agent";
import { Remote } from "../tasks/remote/remote";
import { PyServer } from "../spawn/pyserver";
import { ViewerTask } from "../tasks/observe/viewer";
import { Label } from "../tasks/draw/label";
import { Trail } from "../tasks/draw/trail";
import { Watermark } from "../tasks/draw/watermark";
import { Drawing } from "../tasks/draw";
import { Throttle } from "../tasks/filter/throttle";
import { Record } from "../tasks/transfer/record";
import { PreRoll } from "../targets/preroll";
import { CenterPointFilter } from "../tasks/filter/centerpoint";
import { Broadcast } from "../sources/broadcast";
import { StreamDecoder } from "../sources/decoders/stream";
import { LiveDecoder } from "../sources/decoders/live";

export class Motion extends Agent {
    constructor(broadcast: Broadcast, folder: string, fps: number) {
        const viewer = new ViewerTask("LiveMotion");
        const preroll = new PreRoll(broadcast, 10.5, 256);
        const decoder = new StreamDecoder(broadcast, new LiveDecoder(15), fps);

        super(decoder);

        this.register(new PyServer());
        this.register(preroll);
        this.register(viewer);

        const drawing = new Drawing(
            new Label("yellow", 36, "red"),
            new Trail(),
            new Watermark("LiveMotion"),
        );

        this.addTask(new Throttle(fps));
        this.addTask(new Remote("mega"));
        this.addTask(new CenterPointFilter(1740, 562, 20));
        this.addTask(drawing);
        this.addTask(viewer);

        this.addTask(new Record(preroll, folder, 5, "person"));
        this.addTask(new Record(preroll, folder, 10.5, "animal"));
    }

    public override toString(): string {
        return `${super.toString()}[Motion]`;
    }
}
