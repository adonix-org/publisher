import "dotenv/config";
import "./logging";

import { Daemon } from "./daemon";
import { LiveImage } from "./agents/live";
import { PyServer } from "./pyserver";

new Daemon(new PyServer(), new LiveImage()).start();
