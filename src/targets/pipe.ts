import { PassThrough, Readable, Writable } from "node:stream";
import { Lifecycle } from "../lifecycle";

export class BufferedPipe extends Lifecycle {
    private buffer: PassThrough | undefined;

    constructor(
        private readonly input: Readable,
        private readonly output: Writable,
    ) {
        super();
    }

    protected override async onstart(): Promise<void> {
        await super.onstart();

        this.input.resume();

        this.buffer = new PassThrough({ highWaterMark: 256 * 1024 });
        this.input.pipe(this.buffer);
        this.buffer.pipe(this.output);
    }

    protected override async onstop(): Promise<void> {
        await super.onstop();

        const buffer = this.buffer;
        if (!buffer) return;

        this.input.unpipe(buffer);

        await new Promise<void>((resolve) => {
            buffer.once("finish", resolve);
            buffer.end();
        });
    }

    public override toString(): string {
        return `${super.toString()}[BufferedPipe]`;
    }
}
