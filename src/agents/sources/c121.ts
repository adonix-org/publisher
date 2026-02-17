import { Camera } from "./camera";

const C121_RTSP_URL = process.env.C121_RTSP_URL!;

export class C121 extends Camera {
    private static readonly REFRESH_INTERVAL_SECONDS = 5;

    public override getID(): string {
        return "c121";
    }

    protected override getUrl(): string {
        return C121_RTSP_URL;
    }

    protected override getIntervalSeconds(): number {
        return C121.REFRESH_INTERVAL_SECONDS;
    }
}
