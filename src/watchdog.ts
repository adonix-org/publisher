import "dotenv/config";
import "./logging";

import { PyServer } from "./pyserver";
import { Watchdog } from "./agents/watchdog";
import { application } from "./application";

application.add(new PyServer(), new Watchdog()).start();
