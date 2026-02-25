import "dotenv/config";
import "./logging";

import { PyServer } from "./pyserver";
import { TimeLapse } from "./agents/timelapse";
import { application } from "./application";

application.add(new PyServer(), new TimeLapse()).start();
