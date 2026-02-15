import { Publisher } from "./interfaces";
import { Lifecycle } from "./lifecycle";
import { RtspStream } from "./stream";

export class Agent extends Lifecycle {
    constructor(
        private readonly stream: RtspStream,
        private readonly publisher: Publisher,
    ) {
        super();
        this.stream.onframe = async (frame) => {
            await this.publisher.publish(frame);
        };
    }

    protected override async onstart(): Promise<void> {
        await this.stream.start();
    }

    protected override async onstop(): Promise<void> {
        await this.stream.stop();
    }

    public override toString(): string {
        return `${super.toString()}[Agent]`;
    }
}
