import "dotenv/config";
import "./logging";

import { Movie } from "./agents/movie";
import { PyServer } from "./pyserver";
import { application } from "./application";

application.add(new PyServer(), new Movie()).start();
