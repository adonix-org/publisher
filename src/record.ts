import "dotenv/config";
import "./logging";

import { application } from "./application";
import { Rtsp } from "./sources/rtsp";
import { MpvViewer } from "./targets/viewers/mpv";

import { Recording } from "./targets/recording";
import { PreRoll } from "./targets/preroll";

const C121_RTSP_URL = process.env.C121_RTSP_URL!;

const broadcast = new Rtsp(C121_RTSP_URL);

const loop = new PreRoll(broadcast);
const mpv = new MpvViewer(broadcast);
const recording = new Recording(
    loop,
    "/Users/tybusby/Camera/recordings",
    "mp4",
);

application.register(broadcast, loop, mpv);
application.start();

setTimeout(async () => {
    await recording.start();

    setTimeout(async () => {
        await recording.stop();
    }, 5_000);
}, 10_000);
