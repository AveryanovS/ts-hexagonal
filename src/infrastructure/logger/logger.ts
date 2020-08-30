import pino from 'pino';
import { injectable } from 'inversify';

@injectable()
export class Logger {
    constructor(
        private logger: any = pino({
            name: 'app',
            level: 'info',
        }),
    ) {
    }

    info(...loggingArgs: any[]): void {
        this.logger.info(...loggingArgs);
    }

    error(...loggingArgs: any[]): void {
        this.logger.error(...loggingArgs);
    }
}
