import { Executable } from "./executable";

export abstract class Ffmpeg extends Executable {
    constructor(args: string[]) {
        super("/opt/homebrew/bin/ffmpeg", args);
    }

    public override toString(): string {
        return `${super.toString()}[ffmpeg]`;
    }
}
