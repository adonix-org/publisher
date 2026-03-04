import { Readable } from "node:stream";
import { Broadcast } from "../../sources/broadcast";
import { Executable } from "../../spawn/executable";

export abstract class Viewer extends Executable {
    private stream: Readable | undefined;

    constructor(private readonly broadcast: Broadcast) {
        super();
    }

    protected override async onstart(): Promise<void> {
        await super.onstart();

        this.stream = this.broadcast.subscribe();
        this.stream.pipe(this.child.stdin);

        const cleanup = () => {
            if (this.stream) {
                this.stream.destroy();
                this.stream = undefined;
            }
        };

        this.child.stdin.on("close", cleanup);
        this.child.stdin.on("error", cleanup);
    }

    protected override async onstop(): Promise<void> {
        await super.onstop();

        this.child.stdin.end();
    }

    public override toString(): string {
        return `${super.toString()}[Viewer]`;
    }
}
