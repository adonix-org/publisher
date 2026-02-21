import { setTimeout as sleep } from "node:timers/promises";
import fs from "node:fs/promises";
import path from "node:path";
import { ImageSource } from ".";
import { Annotation, ImageFrame } from "../tasks";

export class Folder implements ImageSource {
    private files: string[] = [];
    private index = 0;

    constructor(private readonly folder: string) {}

    private async loadFiles(): Promise<void> {
        if (this.files.length === 0) {
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

            this.files = entries
                .filter(
                    (e) =>
                        e.isFile() &&
                        imageExts.includes(path.extname(e.name).toLowerCase()),
                )
                .map((e) => path.join(this.folder, e.name))
                .sort();
        }
    }

    public async next(signal: AbortSignal): Promise<ImageFrame | null> {
        if (signal.aborted) return null;

        await this.loadFiles();

        if (this.index >= this.files.length) {
            await sleep(1000);
        }

        const filePath = this.files[this.index++];
        if (!filePath) return null;

        const buffer = await fs.readFile(filePath);
        return {
            image: { buffer, contentType: "image/jpeg" },
            annotations: new Array<Annotation>(),
            version: 1,
        };
    }

    public toString(): string {
        return `[Folder ${this.folder}]`;
    }
}
