const DEBUG_ENABLED = process.env.DEBUG;
const methods = ["log", "info", "warn", "error", "debug"] as const;
const maxLength = Math.max(...methods.map((m) => m.length));

// ANSI color codes
const colors: Record<(typeof methods)[number], string> = {
    log: "\x1b[37m", // white
    info: "\x1b[37m", // white
    warn: "\x1b[33m", // yellow
    error: "\x1b[31m", // red
    debug: "\x1b[35m", // magenta
};
const blue = "\x1b[34m";
const reset = "\x1b[0m";

methods.forEach((method) => {
    const orig = console[method] as (...args: any[]) => void;
    (console as any)[method] = (...args: any[]) => {
        if (method === "debug" && !DEBUG_ENABLED) return;

        const timestamp = new Date()
            .toLocaleString("sv-SE", { hour12: false })
            .replace("T", " ");

        const paddedMethod = method.padEnd(maxLength, " ");
        const color = colors[method];

        orig(
            `${reset}[${timestamp}][${color}${paddedMethod}${reset}]`,
            ...args,
        );
    };
});
