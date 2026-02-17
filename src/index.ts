import "dotenv/config";
import "./logging";
import { Daemon } from "./daemon";
import { RtspAgent } from "./agents/rtsp";
import { Source } from "./interfaces";

const url = process.env.LIVEIMAGE_RTSP_URL;
if (!url) throw new Error("Missing env variable LIVEIMAGE_RTSP_URL");

const c121: Source = {
    id: "c121",
    rtsp: {
        url,
        intervalSeconds: 5,
    },
};

new Daemon(new RtspAgent(c121)).start();
