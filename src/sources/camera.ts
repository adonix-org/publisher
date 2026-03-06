import { AgentSource } from "../agents";
import { StreamDecoder } from "./decoders/stream";
import { MpvViewer } from "../targets/viewers/mpv";
import { ImageFrame } from "../tasks";
import { Rtsp } from "./rtsp";
import { LiveDecoder } from "./decoders/live";

export class Camera extends Rtsp implements AgentSource {
    private readonly viewer = new MpvViewer(this, this.title);
    private readonly decoder = new StreamDecoder(
        this,
        new LiveDecoder(15),
        this.fps,
    );

    constructor(
        url: string,
        private readonly fps: number,
        private readonly title: string = "RTSP Camera",
    ) {
        super(url);

        this.register(this.viewer);
        this.register(this.decoder);
    }

    public async next(): Promise<ImageFrame | null> {
        return await this.decoder.next();
    }

    public override toString(): string {
        return `${super.toString()}[Camera]`;
    }
}
