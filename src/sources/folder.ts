import { setTimeout as sleep } from "node:timers/promises";
import fs from "node:fs/promises";
import path from "node:path";
import { ImageSource } from ".";
import { Annotation, ImageFrame } from "../tasks";
import { Lifecycle } from "../lifecycle";

export class Folder extends Lifecycle implements ImageSource {
    private readonly files: string[] = [];

    constructor(private readonly folder: string) {
        super();
    }

    protected override async onstop(): Promise<void> {
        this.files.length = 0;
    }

    protected override async onstart(): Promise<void> {
        const entries = await fs.readdir(this.folder, {
            withFileTypes: true,
        });

        const imageExts = [
            ".jpg",
            ".jpeg",
            ".png",
            ".webp",
            ".gif",
            ".tiff",
            ".avif",
            ".svg",
        ];

        this.files.push(
            ...entries
                .filter(
                    (e) =>
                        e.isFile() &&
                        imageExts.includes(path.extname(e.name).toLowerCase()),
                )
                .map((e) => path.join(this.folder, e.name))
                .sort(),
        );
    }

    public async next(signal: AbortSignal): Promise<ImageFrame | null> {
        if (signal.aborted) return null;

        if (this.files.length === 0) {
            await sleep(1000);
            return null;
        }

        const filePath = this.files.shift();
        if (!filePath) return null;

        const buffer = await fs.readFile(filePath);
        return {
            image: { buffer, contentType: this.contentTypeFromExt(filePath) },
            annotations: new Array<Annotation>(),
            version: 1,
        };
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
        return `[Folder ${this.folder}]`;
    }
}
