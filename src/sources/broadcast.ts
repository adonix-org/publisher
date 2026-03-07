import { Readable } from "node:stream";

export interface Broadcast {
    get name(): string;

    subscribe(): Readable;
}
