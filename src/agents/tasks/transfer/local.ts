import path from "path";
import { Camera } from "../../sources/camera";
import { Save } from "./save";

export class LocalSave extends Save {
    constructor(camera: Camera) {
        const IMAGE_FOLDER = process.env.LOCAL_IMAGE_FOLDER!;
        super(
            path.join(IMAGE_FOLDER, camera.getName()),
            camera.getName(),
        );
    }
}
