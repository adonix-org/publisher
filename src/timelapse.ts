import "dotenv/config";
import "./logging";

import { Daemon } from "./daemon";
import { TimeLapse } from "./agents/timelapse";

new Daemon(new TimeLapse()).start();
