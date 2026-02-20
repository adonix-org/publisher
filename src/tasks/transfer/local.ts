import path from "node:path";
import { Save } from "./save";

export class LocalFile extends Save {
    constructor(name: string) {
        const IMAGE_FOLDER = process.env.LOCAL_IMAGE_FOLDER!;
        super(path.join(IMAGE_FOLDER, name), name);
    }

    public override toString(): string {
        return `${super.toString()}[LocalFile]`;
    }
}
