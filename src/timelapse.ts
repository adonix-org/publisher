import "dotenv/config";
import "./logging";

import { Daemon } from "./daemon";
//import { TimeLapse } from "./agents/timelapse";
import { Python } from "./python";

new Daemon(new Python()).start();
