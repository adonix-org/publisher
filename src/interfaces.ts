export interface Publisher {
    publish(frame: Buffer): Promise<void>;
}

export interface Source {
    id: string;
    rtsp: RtspConfig;
}

export interface RtspConfig {
    url: string;
    intervalSeconds: number;
}

export interface EventMessage {
    event: string;
}

export interface OnlineMessage extends EventMessage {
    active: number;
    zombies: number;
    subscribers: number;
    publishers: number;
}

export interface HeartbeatOptions {
    pulse: number;
    timeout: number;
}
