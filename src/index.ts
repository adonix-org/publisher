import "dotenv/config";
import "./logging";

import { Agent } from "./publish/agent";
import { LiveImage } from "./publish/live-image";
import { Source } from "./interfaces";
import { Daemon } from "./daemon";
import { PublisherSession } from "./ws/publisher";
import { RtspStream } from "./capture/rtsp-stream";

const url = process.env.LIVEIMAGE_RTSP_URL;
if (!url) throw new Error("Missing env variable LIVEIMAGE_RTSP_URL");

const c121: Source = {
    id: "c121",
    rtsp: {
        url,
        intervalSeconds: 30,
    },
};

const stream = new RtspStream(c121);
const publisher = new LiveImage(c121.id);
const agent = new Agent(stream, publisher);
const session = new PublisherSession(agent);

new Daemon(session).start();
