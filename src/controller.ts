const controller = new AbortController();

export function abort(): void {
    if (!controller.signal.aborted) {
        controller.abort();
    }
}

export const signal = controller.signal;
