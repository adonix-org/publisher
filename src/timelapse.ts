import "dotenv/config";
import "./logging";

import { Daemon } from "./daemon";
import { Python } from "./python";
import { TimeLapse } from "./agents/timelapse";

new Daemon(new TimeLapse(), new Python()).start();
