import { Readable } from "node:stream";

export interface Broadcast {
    subscribe(): Readable;
}
