import "dotenv/config";
import "./logging";

import { application } from "./application";
import { Rtsp } from "./sources/rtsp";

import { Recorder } from "./targets/recorder";

const C121_RTSP_URL = process.env.C121_RTSP_URL!;

const recorder = new Recorder("/Users/tybusby/Camera/recordings");

const rtsp = new Rtsp(C121_RTSP_URL);
rtsp.addConsumer(recorder);

application.register(recorder, rtsp);
application.start();
