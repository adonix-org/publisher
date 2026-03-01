import "dotenv/config";
import "./logging";

import { application } from "./application";
import { Rtsp } from "./sources/rtsp";
import { TransportStream } from "./sources/streams/transport";
import { RecordTransportStream } from "./targets/record";

const C121_RTSP_URL = process.env.C121_RTSP_URL!;

const recorder = new RecordTransportStream("/Users/tybusby/Camera/recordings");

const stream = new TransportStream();
stream.addConsumer(recorder);

const rtsp = new Rtsp(stream, C121_RTSP_URL);
application.register(rtsp, recorder);
application.start();
