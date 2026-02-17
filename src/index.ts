import "dotenv/config";
import "./logging";
import { Daemon } from "./daemon";
import { LiveImage } from "./agents/live";

new Daemon(new LiveImage()).start();
