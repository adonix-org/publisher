import "dotenv/config";
import "./logging";

import { application } from "./application";
import { MonitorLive } from "./agents/monitor";
import { Camera } from "./sources/camera";

const url = process.env.C121_RTSP_URL!;
const folder = process.env.LOCAL_IMAGE_FOLDER!;
const c121 = new Camera("c121", url);

c121.register(new MonitorLive(c121, folder, 1));

application.register(c121).start();
