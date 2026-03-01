import { ImageSource } from ".";
import { ImageFrame } from "../tasks";
import { Encoder } from "./encoder";
import { Rtsp } from "./rtsp";
import { CameraStream } from "./streams/camera";

const C121_RTSP_URL = process.env.C121_RTSP_URL!;

export class C121 extends Rtsp implements ImageSource {
    private readonly codec = new Encoder(new CameraStream());

    constructor() {
        super(C121_RTSP_URL);
    }

    public async next(): Promise<ImageFrame | null> {
        return await this.codec.next();
    }

    public getName(): string {
        return "c121";
    }

    protected getUrl(): string {
        return C121_RTSP_URL;
    }
}
