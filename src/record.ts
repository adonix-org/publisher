import "dotenv/config";
import "./logging";

import { application } from "./application";
import { Rtsp } from "./sources/rtsp";

import { Recorder } from "./targets/recorder";
import { Preview } from "./targets/preview";

const C121_RTSP_URL = process.env.C121_RTSP_URL!;

const recorder = new Recorder("/Users/tybusby/Camera/recordings");
const preview = new Preview("mpegts", "Live Motion");

const rtsp = new Rtsp(C121_RTSP_URL);
rtsp.addConsumer(recorder);
rtsp.addConsumer(preview);

application.register(preview, recorder, rtsp);
application.start();
