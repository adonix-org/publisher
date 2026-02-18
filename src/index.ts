import "dotenv/config";
import "./logging";

import { Daemon } from "./daemon";
import { LiveImage } from "./agents/live";
import { PublisherSession } from "./ws/publisher";

new Daemon(new PublisherSession(new LiveImage())).start();
