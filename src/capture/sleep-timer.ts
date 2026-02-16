import { setTimeout as sleep } from "timers/promises";

export class SleepTimer {
    private static readonly MAX_SAMPLE_SIZE = 100;
    private durations: number[] = [];
    private start = Date.now();

    constructor(private readonly seconds: number) {}

    public awake(): void {
        this.start = Date.now();
    }

    public async sleep(signal?: AbortSignal): Promise<void> {
        const elapsed = Date.now() - this.start;

        this.durations.push(elapsed);
        while (this.durations.length > SleepTimer.MAX_SAMPLE_SIZE) {
            this.durations.shift();
        }

        const sleepMs = this.seconds * 1000 - this.median();
        await sleep(sleepMs, undefined, { signal });
    }

    private median(): number {
        if (this.durations.length === 0) return 0;
        const sorted = this.durations.slice().sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);

        return sorted.length % 2 === 1
            ? sorted[mid]!
            : (sorted[mid - 1]! + sorted[mid]!) / 2;
    }
}
