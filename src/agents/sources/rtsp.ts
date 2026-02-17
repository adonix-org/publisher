import { FfmpegProcess } from "./ffmpeg";
import { SleepTimer } from "./timer";
import { Source } from "../../interfaces";
import { ImageBuffer, ImageSource } from "../interfaces";

export class RtspSource implements ImageSource {
    private readonly timer: SleepTimer;

    constructor(private readonly source: Source) {
        this.timer = new SleepTimer(source.rtsp.intervalSeconds);
    }

    public async next(signal: AbortSignal): Promise<ImageBuffer | null> {
        await this.timer.sleep(signal);

        if (signal.aborted) {
            this.timer.reset();
            return null;
        }

        this.timer.start();

        const buf = await new FfmpegProcess(this.source.rtsp.url).capture();
        console.debug(`${this.toString()} captured image ${buf.length} bytes`);

        return { buffer: buf, contentType: "image/jpeg" };
    }

    public toString(): string {
        return `[RtspSource]`;
    }
}
