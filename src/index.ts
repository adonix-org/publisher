import "dotenv/config";
import "./logging";

import { Agent } from "./agent";
import { LiveImage } from "./live";
import { RtspStream } from "./stream";
import { Source } from "./interfaces";
import { Daemon } from "./daemon";
import { PublisherSession } from "./ws/publisher";

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

const daemon = new Daemon(session);
daemon.start();

process.on("SIGTERM", async () => await daemon.stop());
process.on("SIGINT", async () => await daemon.stop());

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf8");
process.stdin.on("data", async (key) => {
    if (key === "\u0003") {
        // Ctrl+C to exit
        await daemon.stop();
    }
    if (key.toString().toLowerCase() === "q") {
        // q to exit
        await daemon.stop();
    }
    if (key.toString().toLowerCase() === "c") {
        // Press 'c' to clear
        process.stdout.write("\x1Bc");
    }

    if (key === "\r") {
        // Enter key → 5 blank lines
        process.stdout.write("_".repeat(80));
        process.stdout.write("\n".repeat(5));
    }
});
