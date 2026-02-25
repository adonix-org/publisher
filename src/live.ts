import "dotenv/config";
import "./logging";

import { LiveImage } from "./agents/live";
import { PublisherSession } from "./ws/publisher";
import { application } from "./application";

application.add(new PublisherSession(new LiveImage())).start();
