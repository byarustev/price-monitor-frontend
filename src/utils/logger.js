const LOG_LEVELS = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
};

class Logger {
    constructor() {
        this.level = import.meta.env.VITE_LOG_LEVEL || 'info';
        this.papertrailHost = import.meta.env.VITE_PAPERTRAIL_HOST;
        this.papertrailPort = import.meta.env.VITE_PAPERTRAIL_PORT;
        this.hostname = import.meta.env.VITE_PAPERTRAIL_HOSTNAME || 'currency-monitor-frontend';

        // Initialize Papertrail connection if configured
        if (this.papertrailHost && this.papertrailPort) {
            this.initializePapertrail();
        }
    }

    initializePapertrail() {
        const wsUrl = `wss://${this.papertrailHost}:${this.papertrailPort}`;
        this.papertrailSocket = new WebSocket(wsUrl);

        this.papertrailSocket.onopen = () => {
            console.log('Connected to Papertrail');
        };

        this.papertrailSocket.onerror = (error) => {
            console.error('Papertrail connection error:', error);
        };
    }

    // Format message with timestamp and metadata
    formatMessage(level, message, metadata = {}) {
        const timestamp = new Date().toISOString();
        let formattedMessage = `${timestamp} [${level.toUpperCase()}] : ${message}`;

        if (Object.keys(metadata).length > 0) {
            formattedMessage += ` ${JSON.stringify(metadata)}`;
        }

        return formattedMessage;
    }

    // Send logs to Papertrail if configured
    sendToPapertrail(level, message) {
        if (this.papertrailSocket?.readyState === WebSocket.OPEN) {
            const papertrailMessage = {
                hostname: this.hostname,
                program: import.meta.env.MODE || "development",
                level,
                message
            };
            this.papertrailSocket.send(JSON.stringify(papertrailMessage));
        }
    }

    // Check if level should be logged
    shouldLog(level) {
        return LOG_LEVELS[level] <= LOG_LEVELS[this.level];
    }

    // Logging methods
    log(level, message, metadata = {}) {
        if (!this.shouldLog(level)) return;

        const formattedMessage = this.formatMessage(level, message, metadata);

        // Console output with appropriate styling
        const consoleMethod = console[level] || console.log;
        const style = this.getConsoleStyle(level);
        consoleMethod(`%c${formattedMessage}`, style);

        // Send to Papertrail
        this.sendToPapertrail(level, formattedMessage);
    }

    // Console styling for different log levels
    getConsoleStyle(level) {
        const styles = {
            error: 'color: #ff5252; font-weight: bold',
            warn: 'color: #fb8c00; font-weight: bold',
            info: 'color: #2196f3',
            debug: 'color: #757575'
        };
        return styles[level] || '';
    }

    // Convenience methods for each log level
    error(message, metadata) {
        this.log('error', message, metadata);
    }

    warn(message, metadata) {
        this.log('warn', message, metadata);
    }

    info(message, metadata) {
        this.log('info', message, metadata);
    }

    debug(message, metadata) {
        this.log('debug', message, metadata);
    }
}

export const logger = new Logger(); 