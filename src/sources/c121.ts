import { Rtsp } from "./rtsp";

const C121_RTSP_URL = process.env.C121_RTSP_URL!;

export class C121 extends Rtsp {
    constructor(interval?: number) {
        super(C121_RTSP_URL, interval);
    }

    public getName(): string {
        return "c121";
    }

    protected getUrl(): string {
        return C121_RTSP_URL;
    }
}
