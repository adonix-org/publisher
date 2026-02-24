import { CameraStream } from "./streams/camera";
import { RtspSource } from "./rtsp";

const C121_RTSP_URL = process.env.C121_RTSP_URL!;

export class C121 extends RtspSource {
    constructor(interval?: number) {
        super(new CameraStream(), C121_RTSP_URL, interval);
    }

    public getName(): string {
        return "c121";
    }

    protected getUrl(): string {
        return C121_RTSP_URL;
    }
}
