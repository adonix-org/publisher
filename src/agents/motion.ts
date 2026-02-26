import { C121 } from "../sources/c121";
import { Agent } from "./agent";

export class Motion extends Agent {
    constructor() {
        const source = new C121(15, 60);

        super(source);
    }
}
