import { spawn, ChildProcessWithoutNullStreams } from "child_process";

interface H264Chunk {
    data: Buffer;
}

// Adjustable parameters
const RTSP_URL = "rtsp://camera";
const MAX_CHUNKS = 500; // number of H264 chunks in memory

export class PreBufferRecorder {
    private buffer: H264Chunk[] = [];
    private ffmpegRtsp: ChildProcessWithoutNullStreams;
    private ffmpegRecording: ChildProcessWithoutNullStreams | null = null;
    private ffmpegNN: ChildProcessWithoutNullStreams | null = null;

    constructor(private rtspUrl: string) {
        // Spawn FFmpeg to read RTSP and copy H.264 packets
        this.ffmpegRtsp = spawn("ffmpeg", [
            "-rtsp_transport",
            "tcp",
            "-i",
            this.rtspUrl,
            "-c",
            "copy",
            "-f",
            "mpegts",
            "pipe:1",
        ]);

        // Handle H.264 chunks for rolling buffer
        this.ffmpegRtsp.stdout.on("data", (chunk: Buffer) => {
            this.pushToBuffer(chunk);

            // If NN decoding is active, feed chunk to MJPEG FFmpeg
            if (this.ffmpegNN) {
                this.ffmpegNN.stdin.write(chunk);
            }

            // If recording is active, feed chunk to recording FFmpeg
            if (this.ffmpegRecording) {
                this.ffmpegRecording.stdin.write(chunk);
            }
        });

        this.ffmpegRtsp.stderr.on("data", (d) =>
            console.error("FFmpeg RTSP:", d.toString()),
        );
        this.ffmpegRtsp.on("exit", (code, signal) =>
            console.log("FFmpeg RTSP exited", code, signal),
        );
    }

    private pushToBuffer(chunk: Buffer) {
        this.buffer.push({ data: chunk });
        if (this.buffer.length > MAX_CHUNKS) this.buffer.shift();
    }

    /** Start FFmpeg to decode H.264 → MJPEG for NN */
    startNNDetection() {
        if (this.ffmpegNN) return;

        this.ffmpegNN = spawn("ffmpeg", [
            "-f",
            "mpegts",
            "-i",
            "pipe:0",
            "-r",
            "15",
            "-f",
            "image2pipe",
            "-vcodec",
            "mjpeg",
            "pipe:1",
        ]);

        this.ffmpegNN.stdout.on("data", (_frame: Buffer) => {
            // TODO: send frame to NN detection
            // e.g., detectMotion(frame)
        });

        this.ffmpegNN.stderr.on("data", (d) =>
            console.error("FFmpeg NN:", d.toString()),
        );
    }

    /** Stop MJPEG NN decoding */
    stopNNDetection() {
        if (!this.ffmpegNN) return;
        this.ffmpegNN.stdin.end();
        this.ffmpegNN.kill();
        this.ffmpegNN = null;
    }

    /** Start recording MP4 from buffer + live stream */
    startRecording(outputPath: string) {
        if (this.ffmpegRecording) return;

        this.ffmpegRecording = spawn("ffmpeg", [
            "-f",
            "mpegts",
            "-i",
            "pipe:0",
            "-c",
            "copy",
            outputPath,
        ]);

        // Feed buffered H.264 chunks immediately
        for (const chunk of this.buffer) {
            this.ffmpegRecording.stdin.write(chunk.data);
        }

        this.ffmpegRecording.stderr.on("data", (d) =>
            console.error("FFmpeg Recording:", d.toString()),
        );
        this.ffmpegRecording.on("exit", (code, signal) =>
            console.log("Recording FFmpeg exited", code, signal),
        );
    }

    /** Stop MP4 recording */
    stopRecording() {
        if (!this.ffmpegRecording) return;
        this.ffmpegRecording.stdin.end();
        this.ffmpegRecording = null;
    }

    /** Close everything */
    close() {
        this.stopRecording();
        this.stopNNDetection();
        this.ffmpegRtsp.kill();
    }
}

const recorder = new PreBufferRecorder(RTSP_URL);

// Start MJPEG NN detection
recorder.startNNDetection();

// Later, motion detected!
recorder.startRecording("event.mp4");

// When done
setTimeout(() => {
    recorder.stopRecording();
}, 10000);
