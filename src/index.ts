import "dotenv/config";
import "./logging";

import { Camera } from "./agents/camera";
import { application } from "./application";

application.register(new Camera()).start();
