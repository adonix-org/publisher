import "dotenv/config";
import "./logging";

import { Camera } from "./agents/camera";
import { application } from "./application";
import { PyServer } from "./pyserver";

application.add(new PyServer(), new Camera()).start();
