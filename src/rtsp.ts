import "dotenv/config";
import "./logging";

import { Daemon } from "./daemon";
import { C121 } from "./sources/c121";

new Daemon(new C121(5)).start();
