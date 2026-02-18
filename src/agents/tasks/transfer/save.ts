import { promises as fs } from "fs";
import { ImageBuffer, ImageTask } from "../../interfaces";

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
        private readonly prefix: string = "image",
    ) {}

    private getTimestamp(): string {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, "0");
        const dd = String(now.getDate()).padStart(2, "0");
        const hh = String(now.getHours()).padStart(2, "0");
        const min = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");

        return `${yyyy}-${mm}-${dd}_${hh}-${min}-${ss}`;
    }

    public async process(image: ImageBuffer): Promise<ImageBuffer | null> {
        const ext = mimeToExt[image.contentType] ?? "bin";
        const filename = `${this.prefix}_${this.getTimestamp()}.${ext}`;
        const filepath = `${this.directory}/${filename}`;

        await fs.writeFile(filepath, image.buffer);
        return image;
    }

    public toString(): string {
        return `[Save]`;
    }
}
