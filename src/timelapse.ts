import "dotenv/config";
import "./logging";

import { Daemon } from "./daemon";
import { PyServer } from "./pyserver";
import { TimeLapse } from "./agents/timelapse";

new Daemon(new PyServer(), new TimeLapse()).start();
