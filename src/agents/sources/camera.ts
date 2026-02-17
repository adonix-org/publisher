import { FfmpegProcess } from "./ffmpeg";
import { SleepTimer } from "./timer";
import { ImageBuffer, ImageSource } from "../interfaces";

export abstract class Camera implements ImageSource {
    protected static readonly DEFAULT_INTERVAL_SECONDS = 30;

    private readonly timer: SleepTimer;

    constructor() {
        this.timer = new SleepTimer(this.getIntervalSeconds());
    }

    public abstract getName(): string;
    protected abstract getUrl(): string;
    protected getIntervalSeconds(): number {
        return Camera.DEFAULT_INTERVAL_SECONDS;
    }

    public async next(signal: AbortSignal): Promise<ImageBuffer | null> {
        await this.timer.sleep(signal);

        this.timer.start();

        const buffer = await new FfmpegProcess(this.getUrl()).capture();
        console.debug(
            `${this.toString()} captured image ${buffer.length} bytes`,
        );
        return { buffer, contentType: "image/jpeg" };
    }

    public toString(): string {
        return `[Camera-${this.getName()}]`;
    }
}
