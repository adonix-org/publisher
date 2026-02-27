import "dotenv/config";
import "./logging";

import { application } from "./application";
import { PyServer } from "./spawn/pyserver";

application.register(new PyServer()).start();
