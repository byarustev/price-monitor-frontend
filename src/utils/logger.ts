// import { WebSocket } from 'ws';

interface LoggerOptions {
    level: LogLevel;
    papertrailHost?: string;
    papertrailPort?: number;
    hostname?: string;
}

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogMetadata {
    [key: string]: unknown;
}

const LOG_LEVELS: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
};

class Logger {
    private level: LogLevel;
    private papertrailSocket: WebSocket | null;
    private hostname: string;

    constructor(options: LoggerOptions = { level: 'info' }) {
        this.level = options.level;
        this.hostname = options.hostname || 'currency-monitor-frontend';
        this.papertrailSocket = null;

        if (options.papertrailHost && options.papertrailPort) {
            this.initializePapertrail(options.papertrailHost, options.papertrailPort);
        }
    }

    private initializePapertrail(host: string, port: number): void {
        const wsUrl = `wss://${host}:${port}`;
        this.papertrailSocket = new WebSocket(wsUrl);

        this.papertrailSocket.onopen = () => {
            console.log('Connected to Papertrail');
        };

        this.papertrailSocket.onerror = (error: Event) => {
            console.error('Papertrail connection error:', error);
        };
    }

    private formatMessage(level: LogLevel, message: string, metadata: LogMetadata = {}): string {
        const timestamp = new Date().toISOString();
        let formattedMessage = `${timestamp} [${level.toUpperCase()}] : ${message}`;

        if (Object.keys(metadata).length > 0) {
            formattedMessage += ` ${JSON.stringify(metadata)}`;
        }

        return formattedMessage;
    }

    private sendToPapertrail(level: LogLevel, message: string): void {
        if (this.papertrailSocket?.readyState === WebSocket.OPEN) {
            const papertrailMessage = {
                hostname: this.hostname,
                program: import.meta.env.MODE || 'development',
                level,
                message
            };

            this.papertrailSocket.send(JSON.stringify(papertrailMessage));
        }
    }

    private shouldLog(level: LogLevel): boolean {
        return LOG_LEVELS[level] <= LOG_LEVELS[this.level];
    }

    private log(level: LogLevel, message: string, metadata: LogMetadata = {}): void {
        if (!this.shouldLog(level)) return;

        const formattedMessage = this.formatMessage(level, message, metadata);

        // Console output with appropriate styling
        const consoleMethod = console[level] || console.log;
        const style = this.getConsoleStyle(level);
        consoleMethod(`%c${formattedMessage}`, style);

        // Send to Papertrail
        this.sendToPapertrail(level, formattedMessage);
    }

    private getConsoleStyle(level: LogLevel): string {
        const styles: Record<LogLevel, string> = {
            error: 'color: #ff5252; font-weight: bold',
            warn: 'color: #fb8c00; font-weight: bold',
            info: 'color: #2196f3',
            debug: 'color: #757575'
        };
        return styles[level];
    }

    public error(message: string, metadata?: LogMetadata): void {
        this.log('error', message, metadata);
    }

    public warn(message: string, metadata?: LogMetadata): void {
        this.log('warn', message, metadata);
    }

    public info(message: string, metadata?: LogMetadata): void {
        this.log('info', message, metadata);
    }

    public debug(message: string, metadata?: LogMetadata): void {
        this.log('debug', message, metadata);
    }
}

// Create and export logger instance
export const logger = new Logger({
    level: (import.meta.env.VITE_LOG_LEVEL as LogLevel) || 'info',
    papertrailHost: import.meta.env.VITE_PAPERTRAIL_HOST,
    papertrailPort: import.meta.env.VITE_PAPERTRAIL_PORT ?
        parseInt(import.meta.env.VITE_PAPERTRAIL_PORT) : undefined,
    hostname: import.meta.env.VITE_PAPERTRAIL_HOSTNAME
}); 