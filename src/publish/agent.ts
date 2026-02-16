import { Lifecycle } from "../lifecycle";
import { Publisher } from "./publisher";
import { DataProvider } from "../interfaces";

export class Agent<T extends Lifecycle & DataProvider> extends Lifecycle {
    constructor(
        private readonly provider: T,
        private readonly publisher: Publisher,
    ) {
        super(provider);

        this.provider.onData = async (data) => {
            await this.publisher.publish(data);
        };
    }

    public override toString(): string {
        return `${super.toString()}[Agent]`;
    }
}
