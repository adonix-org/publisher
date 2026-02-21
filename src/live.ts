import "dotenv/config";
import "./logging";

import { Daemon } from "./daemon";
import { LiveImage } from "./agents/live";
import { PublisherSession } from "./ws/publisher";
import { PyServer } from "./pyserver";

new Daemon(new PyServer(), new PublisherSession(new LiveImage())).start();
