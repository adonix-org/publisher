import { ErrorTask, ImageError } from "../../agents/interfaces";

export class LogError implements ErrorTask {
    public async handle(err: ImageError): Promise<void> {
        console.error(err.source, err.error.message);
    }

    public toString(): string {
        return "LogError";
    }
}
