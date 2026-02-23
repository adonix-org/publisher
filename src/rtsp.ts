import "dotenv/config";
import "./logging";

import { Daemon } from "./daemon";
import { RtspCamera } from "./sources/rtsp";

const C121_RTSP_URL = process.env.C121_RTSP_URL!;

new Daemon(new RtspCamera(C121_RTSP_URL)).start();
