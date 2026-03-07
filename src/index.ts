import "dotenv/config";
import "./logging";

import { application } from "./application";
import { Motion } from "./agents/motion";
import { Camera } from "./sources/camera";

const url = process.env.C121_RTSP_URL!;
const c121 = new Camera("c121", url);

const folder = process.env.LOCAL_IMAGE_FOLDER!;
const agent = new Motion(c121, folder, 1);

c121.register(agent);

application.register(c121).start();
