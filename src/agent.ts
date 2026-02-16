import { Publisher } from "./interfaces";
import { Lifecycle } from "./lifecycle";
import { RtspStream } from "./stream";

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
