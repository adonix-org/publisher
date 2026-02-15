import { Publisher } from "./interfaces";

const POST_URL_BASE = process.env.LIVEIMAGE_BASE;
const ADMIN_KEY = process.env.LIVEIMAGE_ADMIN_KEY;

export class LiveImage implements Publisher {
    constructor(private readonly sourceId: string) {}

    public async publish(frame: Buffer): Promise<void> {
        try {
            const response = await fetch(`${POST_URL_BASE}/${this.sourceId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${ADMIN_KEY}`,
                    "Content-Type": "image/jpeg",
                },
                body: new Uint8Array(frame),
            });

            if (!response.ok) {
                throw new Error(await response.json());
            }

            console.info(this.toString(), `image published (${frame.length})`);
        } catch (err) {
            console.error(this.toString(), "upload failed", err);
        }
    }

    public toString(): string {
        return `[LiveImage][${this.sourceId}]`;
    }
}
