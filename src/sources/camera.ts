import { ImageSource } from ".";
import { FfmpegProcess } from "./ffmpeg";
import { SleepTimer } from "./timer";
import { ImageBuffer } from "../tasks";

export abstract class Camera implements ImageSource {
    protected static readonly DEFAULT_INTERVAL_SECONDS = 30;

    private readonly timer: SleepTimer;

    constructor(intervalSeconds: number = Camera.DEFAULT_INTERVAL_SECONDS) {
        this.timer = new SleepTimer(intervalSeconds);
    }

    public abstract getName(): string;
    protected abstract getUrl(): string;

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
