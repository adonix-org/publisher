import "dotenv/config";
import "./logging";

import { Daemon } from "./daemon";
import { PyServer } from "./pyserver";
import { TimeLapse } from "./agents/timelapse";

const daemon = new Daemon();
daemon.addChild(new PyServer());
daemon.addChild(new TimeLapse(daemon));
daemon.start();
