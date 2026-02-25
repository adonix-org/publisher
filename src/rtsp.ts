import "dotenv/config";
import "./logging";

import { C121 } from "./sources/c121";
import { application } from "./application";

application.add(new C121(5)).start();
