import "dotenv/config";
import "./logging";

import { Camera } from "./agents/camera";
import { application } from "./application";

application.register(new Camera()).start();

setInterval(() => {
    const { rss, heapUsed, heapTotal, external } = process.memoryUsage();
    console.log(
        `[Memory] RSS: ${(rss / 1024 / 1024).toFixed(2)} MB | HeapUsed: ${(heapUsed / 1024 / 1024).toFixed(2)} MB | HeapTotal: ${(heapTotal / 1024 / 1024).toFixed(2)} MB | External: ${(external / 1024 / 1024).toFixed(2)} MB`,
    );
}, 5000);
