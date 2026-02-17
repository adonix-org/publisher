import { setTimeout as sleep } from "timers/promises";

export class SleepTimer {
    private static readonly MAX_SAMPLE_SIZE = 100;
    private static readonly MIN_SLEEP_MS = 500;

    private durations: number[] = [];
    private _start = 0;

    constructor(private readonly seconds: number) {}

    public start(): void {
        this._start = Date.now();
    }

    public reset(): void {
        this._start = 0;
    }

    public async sleep(signal?: AbortSignal): Promise<void> {
        if (this._start === 0) {
            return;
        }

        const elapsed = Date.now() - this._start;
        this.durations.push(elapsed);
        while (this.durations.length > SleepTimer.MAX_SAMPLE_SIZE) {
            this.durations.shift();
        }

        const sleepMs = Math.max(
            SleepTimer.MIN_SLEEP_MS,
            this.seconds * 1000 - this.median(),
        );
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
