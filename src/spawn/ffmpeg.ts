import { Executable } from "./executable";

export abstract class Ffmpeg extends Executable {
    constructor() {
        super();
    }

    protected override executable(): string {
        return "/opt/homebrew/bin/ffmpeg";
    }

    public override toString(): string {
        return `${super.toString()}[ffmpeg]`;
    }
}
