import { Lifecycle } from "../lifecycle";
import { RtspStream } from "../capture/rtsp-stream";
import { Publisher } from "./publisher";

export class Agent extends Lifecycle {
    constructor(
        private readonly stream: RtspStream,
        private readonly publisher: Publisher,
    ) {
        super(stream);

        this.stream.onframe = async (frame) => {
            await this.publisher.publish(frame);
        };
    }

    public override toString(): string {
        return `${super.toString()}[Agent]`;
    }
}
