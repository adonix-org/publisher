import fs from "node:fs/promises";
import path from "node:path";
import { Annotation, ImageFrame } from "../tasks";
import { FrameQueue } from "./queue";

export class SourceFolder extends FrameQueue {
    constructor(private readonly folder: string) {
        super();
    }

    protected override async onstart(): Promise<void> {
        const entries = await fs.readdir(this.folder, {
            withFileTypes: true,
        });

        const imageExts = new Set([
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
            ".gif",
            ".tiff",
            ".avif",
            ".svg",
        ]);

        const files = entries
            .filter(
                (e) =>
                    e.isFile() &&
                    imageExts.has(path.extname(e.name).toLowerCase()),
            )
            .map((e) => path.join(this.folder, e.name))
            .sort();

        for (const file of files) {
            const buffer = await fs.readFile(file);
            const frame: ImageFrame = {
                image: {
                    buffer,
                    contentType: this.contentTypeFromExt(file),
                },
                annotations: new Array<Annotation>(),
                version: 1,
            };
            this.push(frame);
        }

        void this.stop();
    }

    private contentTypeFromExt(file: string): string {
        const ext = path.extname(file).toLowerCase();

        switch (ext) {
            case ".png":
                return "image/png";
            case ".webp":
                return "image/webp";
            case ".gif":
                return "image/gif";
            case ".tiff":
                return "image/tiff";
            case ".avif":
                return "image/avif";
            case ".svg":
                return "image/svg+xml";
            default:
                return "image/jpeg";
        }
    }

    public override toString(): string {
        return `${super.toString()}[SourceFolder ${this.folder}]`;
    }
}
