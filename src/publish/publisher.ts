export interface Publisher {
    publish(frame: Buffer): Promise<void>;
}
