import "dotenv/config";
import "./logging";

import { application } from "./application";
import { RtspMpegTS } from "./sources/rtsp-mpegets";
import { TransportStream } from "./sources/streams/transport";
import { RecordTransportStream } from "./targets/record";
import { Preview } from "./targets/preview";

const C121_RTSP_URL = process.env.C121_RTSP_URL!;

const recorder = new RecordTransportStream("/Users/tybusby/Camera/recordings");

const preview = new Preview("mpegts", "LiveMotion");
const stream = new TransportStream(recorder, preview);
const source = new RtspMpegTS(stream, C121_RTSP_URL);

application.register(source);
application.start();
