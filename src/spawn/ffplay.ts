import { Executable } from "./executable";

export abstract class Ffplay extends Executable {
    protected override executable(): string {
        return "/opt/homebrew/bin/ffplay";
    }

    public override toString(): string {
        return `${super.toString()}[ffplay]`;
    }
}
