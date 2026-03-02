import { ImageTask } from "../../tasks";
import { StreamProvider } from "../../sources/rtsp";
import { Viewer } from "./viewer";

export class MpvViewer extends Viewer implements ImageTask {
    constructor(
        provider: StreamProvider,
        private readonly title: string = "Publisher",
    ) {
        super(provider);
    }

    protected override executable(): string {
        return "/opt/homebrew/bin/mpv";
    }

    protected override args(): string[] {
        const args = ["--cache=no", `--title=${this.title}`, "-"];
        return args;
    }

    protected override async onstart(): Promise<void> {
        await super.onstart();

        this.child.stdout.on("data", (chunk) => {
            console.info(this.toString(), chunk.toString().trim());
        });
    }

    public override toString(): string {
        return `${super.toString()}[mpv]`;
    }
}
