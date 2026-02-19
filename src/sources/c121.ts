import { Camera } from "./camera";

const C121_RTSP_URL = process.env.C121_RTSP_URL!;

export class C121 extends Camera {
    constructor(intervalSeconds?: number) {
        super(intervalSeconds);
    }

    public override getName(): string {
        return "c121";
    }

    protected override getUrl(): string {
        return C121_RTSP_URL;
    }
}
