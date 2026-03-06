import { AgentSource } from "../agents";
import { Camera } from "./camera";

const C121_RTSP_URL = process.env.C121_RTSP_URL!;

export class C121 extends Camera implements AgentSource {
    constructor(fps: number) {
        super(C121_RTSP_URL, fps, "Tapo C121 - Front Door");
    }

    public getName(): string {
        return "c121";
    }
}
