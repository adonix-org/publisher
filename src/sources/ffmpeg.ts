import { spawn, ChildProcessWithoutNullStreams } from "child_process";

export class FfmpegProcess {
    constructor(private readonly url: string) {}

    public capture(): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            if (!this.url) {
                reject(new Error("Missing URL"));
                return;
            }

            const buffer: Buffer[] = [];
            const args = [
                "-loglevel",
                "error",
                "-timeout",
                "5000000",
                "-rtsp_transport",
                "tcp",
                "-i",
                this.url,
                "-frames:v",
                "1",
                "-f",
                "mjpeg",
                "pipe:1",
            ];
            const ffmpeg: ChildProcessWithoutNullStreams = spawn(
                "/opt/homebrew/bin/ffmpeg",
                args,
            );

            ffmpeg.stdout.on("data", (chunk) => buffer.push(chunk));

            ffmpeg.on("error", reject);

            ffmpeg.on("close", (code) => {
                if (code === 0 && buffer.length > 0) {
                    resolve(Buffer.concat(buffer));
                } else {
                    reject(new Error(`ffmpeg exited with code ${code}`));
                }
            });
        });
    }
}
