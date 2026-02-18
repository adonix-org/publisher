import path from "node:path";
import { Camera } from "../../sources/camera";
import { Save } from "./save";

export class LocalFolder extends Save {
    constructor(camera: Camera) {
        const IMAGE_FOLDER = process.env.LOCAL_IMAGE_FOLDER!;
        super(path.join(IMAGE_FOLDER, camera.getName()), camera.getName());
    }

    public override toString(): string {
        return `${super.toString()}[LocalFolder]`;
    }
}
