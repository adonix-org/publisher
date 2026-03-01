import "dotenv/config";
import "./logging";

import { application } from "./application";
import { Rtsp } from "./sources/rtsp";

import { Recorder } from "./targets/recorder";
import { Preview } from "./targets/preview";

const C121_RTSP_URL = process.env.C121_RTSP_URL!;

const rtsp = new Rtsp(C121_RTSP_URL);

const preview = new Preview(rtsp, "mpegts", "LiveMotion");
const recorder = new Recorder(rtsp, "/Users/tybusby/Camera/recordings");

application.register(rtsp);
application.start();

recorder;
preview;

async function recordLoop() {
    while (true) {
        // STOP phase
        if (recorder.running) {
            await recorder.stop();
        }
        await new Promise((r) => setTimeout(r, 3_000)); // 3s stopped

        // START phase
        await recorder.start();
        await new Promise((r) => setTimeout(r, 10_000)); // 10s recording
    }
}

recordLoop().catch(console.error);
