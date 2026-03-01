import "dotenv/config";
import "./logging";

import { application } from "./application";
import { Rtsp } from "./sources/rtsp";
import { MpvViewer } from "./targets/viewers/mpv";

// import { Recorder } from "./targets/recorder";

const C121_RTSP_URL = process.env.C121_RTSP_URL!;

const rtsp = new Rtsp(C121_RTSP_URL);

const mpv = new MpvViewer(rtsp);
// const recorder = new Recorder(rtsp, "/Users/tybusby/Camera/recordings");

application.register(rtsp, mpv);
application.start();
