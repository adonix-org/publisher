import "dotenv/config";
import "./logging";

import { application } from "./application";
import { Rtsp } from "./sources/rtsp";

import { Recorder } from "./targets/recorder";
import { MPV } from "./targets/mpv";

const C121_RTSP_URL = process.env.C121_RTSP_URL!;

const rtsp = new Rtsp(C121_RTSP_URL);

const preview = new MPV(rtsp);
const recorder = new Recorder(rtsp, "/Users/tybusby/Camera/recordings");

application.register(rtsp, preview, recorder);
application.start();

preview;
