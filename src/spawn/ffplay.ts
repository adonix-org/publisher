import { Executable } from "./executable";

export abstract class Ffplay extends Executable {
    constructor(args: string[]) {
        super("/opt/homebrew/bin/ffplay", args);
    }

    public override toString(): string {
        return `${super.toString()}[ffplay]`;
    }
}
