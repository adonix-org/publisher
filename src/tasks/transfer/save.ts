import path from "node:path";
import { promises as fs } from "node:fs";
import { randomBytes } from "node:crypto";
import { ImageFrame, ImageTask } from "..";

const mimeToExt: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/bmp": "bmp",
};

export class Save implements ImageTask {
    constructor(
        private readonly directory: string,
        private readonly name: string = "image"
    ) {}

    private getTimestamp(): string {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const hh = String(now.getHours()).padStart(2, "0");
        const min = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");
        const ms = String(now.getMilliseconds()).padStart(3, "0");

        return `${yyyy}${mm}${dd}_${hh}${min}${ss}_${ms}`;
    }

    private getSuffix(): string {
        return randomBytes(4).toString("hex");
    }

    private getPrefix(): string {
        return this.name
            .replaceAll(/[^ -~]/g, "_")
            .replaceAll(/[/\\?%*:|"<>]/g, "_")
            .trim();
    }

    public async process(frame: ImageFrame): Promise<ImageFrame | null> {
        const ext = mimeToExt[frame.image.contentType] ?? "bin";

        const timestamp = this.getTimestamp();
        const suffix = this.getSuffix();
        const prefix = this.getPrefix();

        const filename = `${prefix}_${timestamp}_${suffix}`;
        const filepath = path.join(this.directory, `${filename}.${ext}`);
        const tempfile = path.join(this.directory, `${filename}.filepart`);

        await fs.writeFile(tempfile, frame.image.buffer);
        await fs.rename(tempfile, filepath);

        return frame;
    }

    public toString(): string {
        return `[Save]`;
    }
}
