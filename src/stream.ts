import { SleepTimer } from "./timer";
import { Source } from "./interfaces";
import { FfmpegProcess } from "./ffmpeg";
import { Lifecycle } from "./lifecycle";

export class RtspStream extends Lifecycle {
    private promise: Promise<void> | null = null;
    private timer: SleepTimer;
    private controller: AbortController | null = null;

    public onframe?: (frame: Buffer) => Promise<void>;

    constructor(private readonly source: Source) {
        super();
        this.timer = new SleepTimer(this.source.rtsp.intervalSeconds);
    }

    protected override async onstart(): Promise<void> {
        await super.onstart();
        this.controller = new AbortController();
        this.promise = this.loop(this.controller.signal);
    }

    public override async onstop(): Promise<void> {
        await super.onstop();
        this.controller?.abort();
        await this.promise;
    }

    private async loop(signal: AbortSignal): Promise<void> {
        while (!signal.aborted) {
            try {
                this.timer.awake();
                const frame = await new FfmpegProcess(
                    this.source.rtsp.url,
                ).capture();
                if (this.onframe) {
                    this.onframe(frame);
                }
                await this.timer.sleep(signal);
            } catch (err) {
                if (!(err instanceof Error && err.name === "AbortError"))
                    throw err;
            }
        }
    }

    public override toString(): string {
        return `${super.toString()}[RtspStream][${this.source.id}]`;
    }
}
