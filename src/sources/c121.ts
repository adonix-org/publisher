import { CameraStream } from "./streams/camera";
import { RtspMjpeg } from "./rtsp-mjpeg";

const C121_RTSP_URL = process.env.C121_RTSP_URL!;

export class C121 extends RtspMjpeg {
    constructor(fps?: number, bufferSize?: number) {
        super(new CameraStream(bufferSize), C121_RTSP_URL, fps);
    }

    public getName(): string {
        return "c121";
    }

    protected getUrl(): string {
        return C121_RTSP_URL;
    }
}
