import { PassThrough } from "node:stream";
import { Ffmpeg } from "../spawn/ffmpeg";
import { DataConsumer } from "./streams/transport";

export class Rtsp extends Ffmpeg {
    private readonly consumers: DataConsumer[] = [];
    private buffers: PassThrough[] = [];

    constructor(url: string) {
        const args = [
            "-loglevel",
            "fatal",
            "-rtsp_transport",
            "tcp",
            "-use_wallclock_as_timestamps",
            "1",
            "-i",
            url,
            "-an",
            "-c",
            "copy",
            "-f",
            "mpegts",
            "pipe:1",
        ];

        super(args);
    }

    public addConsumer(consumer: DataConsumer): void {
        this.consumers.push(consumer);
    }

    protected override async onstart(): Promise<void> {
        await super.onstart();

        this.buffers = [];

        for (const consumer of this.consumers) {
            const buffer = new PassThrough({ highWaterMark: 256 * 1024 });
            this.child.stdout.pipe(buffer).pipe(consumer.getWritable());
            this.buffers.push(buffer);
        }
    }

    protected override async onstop(): Promise<void> {
        await super.onstop();

        for (const buffer of this.buffers) {
            buffer.end();
            buffer.unpipe();
        }

        this.buffers = [];
    }

    public override toString(): string {
        return `${super.toString()}[Rtsp]`;
    }
}
