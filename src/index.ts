import "dotenv/config";
import "./logging";

import { application } from "./application";
import { Motion } from "./agents/motion";

application.register(new Motion()).start();
