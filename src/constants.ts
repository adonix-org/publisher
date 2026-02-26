const controller = new AbortController();

export function abort(reason?: unknown): void {
    controller.abort(reason);
}

export const signal = controller.signal;
