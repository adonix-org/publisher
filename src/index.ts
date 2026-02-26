import "dotenv/config";
import "./logging";

import { MonitorLive } from "./agents/monitor";
import { application } from "./application";

application.register(new MonitorLive()).start();
