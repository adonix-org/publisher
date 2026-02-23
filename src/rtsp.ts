import "dotenv/config";
import "./logging";

import { Daemon } from "./daemon";
import { Rtsp } from "./sources/rtsp";

const C121_RTSP_URL = process.env.C121_RTSP_URL!;

new Daemon(new Rtsp(C121_RTSP_URL)).start();
