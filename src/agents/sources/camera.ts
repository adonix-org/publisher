import { FfmpegProcess } from "./ffmpeg";
import { SleepTimer } from "./timer";
import { ImageBuffer, ImageSource } from "../interfaces";

export abstract class Camera implements ImageSource {
    protected static readonly DEFAULT_INTERVAL_SECONDS = 30;

    private readonly timer: SleepTimer;

    constructor() {
        this.timer = new SleepTimer(this.getIntervalSeconds());
    }

    public abstract getID(): string;
    protected abstract getUrl(): string;
    protected getIntervalSeconds(): number {
        return Camera.DEFAULT_INTERVAL_SECONDS;
    }

    public async next(signal: AbortSignal): Promise<ImageBuffer | null> {
        await this.timer.sleep(signal);

        this.timer.start();

        const buf = await new FfmpegProcess(this.getUrl()).capture();
        console.debug(`${this.toString()} captured image ${buf.length} bytes`);
        return { buffer: buf, contentType: "image/jpeg" };
    }

    public toString(): string {
        return `[Camera-${this.getID()}]`;
    }
}
