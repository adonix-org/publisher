import { Readable } from "node:stream";

export interface Broadcast {
    getStream(): Readable;
}
