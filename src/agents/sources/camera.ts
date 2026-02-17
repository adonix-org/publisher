import { FfmpegProcess } from "./ffmpeg";
import { SleepTimer } from "./timer";
import { ImageBuffer, ImageSource } from "../interfaces";

export abstract class Camera implements ImageSource {
    private readonly timer: SleepTimer;

    constructor() {
        this.timer = new SleepTimer(this.getIntervalSeconds());
    }

    public abstract getID(): string;
    protected abstract getUrl(): string;
    protected abstract getIntervalSeconds(): number;

    public async next(signal: AbortSignal): Promise<ImageBuffer | null> {
        await this.timer.sleep(signal);

        if (signal.aborted) {
            this.timer.reset();
            return null;
        }

        this.timer.start();

        const buf = await new FfmpegProcess(this.getUrl()).capture();
        console.debug(`${this.toString()} captured image ${buf.length} bytes`);

        return { buffer: buf, contentType: "image/jpeg" };
    }

    public toString(): string {
        return `[Camera]`;
    }
}
