import "dotenv/config";
import "./logging";

import { Daemon } from "./daemon";
import { PyServer } from "./pyserver";
import { Watchdog } from "./agents/watchdog";

new Daemon(new PyServer(), new Watchdog()).start();
