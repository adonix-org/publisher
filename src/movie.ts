import "dotenv/config";
import "./logging";

import { Daemon } from "./daemon";
import { Movie } from "./agents/movie";
import { PyServer } from "./pyserver";

const daemon = new Daemon();
daemon.addChild(new PyServer());
daemon.addChild(new Movie(daemon));
daemon.start();
