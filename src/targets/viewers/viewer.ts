import { Readable } from "node:stream";
import { Broadcast } from "../../sources/broadcast";
import { Executable } from "../../spawn/executable";
import { ImageFrame, ImageTask } from "../../tasks";

export abstract class Viewer extends Executable implements ImageTask {
    private stream: Readable | undefined;

    constructor(private readonly broadcast: Broadcast) {
        super();
    }

    protected override async onstart(): Promise<void> {
        await super.onstart();

        this.stream = this.broadcast.subscribe();
        this.stream.pipe(this.child.stdin);
    }

    protected override async onstop(): Promise<void> {
        if (this.stream) {
            this.stream.unpipe(this.child.stdin);
            this.child.stdin.end();

            this.stream.destroy();
            this.stream = undefined;
        }

        await super.onstop();
    }

    public async process(frame: ImageFrame): Promise<ImageFrame | null> {
        this.child.stdin.write(frame.image.buffer);

        return frame;
    }

    public override toString(): string {
        return `${super.toString()}[Viewer]`;
    }
}
