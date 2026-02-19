// This module provides a simple logger that can be configured via environment variables.

/**
 * Defines the available log levels.
 * Log messages will only be displayed if their level is greater than or equal to the configured LOG_LEVEL.
 */
export enum LogLevel {
    NONE = 0, // No logs
    ERROR = 1, // Only error messages
    WARN = 2, // Warning and error messages
    INFO = 3, // Info, warning, and error messages
    DEBUG = 4, // All messages (detailed debugging)
}

/**
 * Logger class for controlled logging based on environment variables.
 */
class Logger {
    private readonly currentLevel: LogLevel;

    constructor() {
        // Determine the log level from the environment variable.
        // Defaults to INFO if LOG_LEVEL is not set or invalid.
        const logLevelEnv = process.env.LOG_LEVEL?.toUpperCase();
        switch (logLevelEnv) {
            case "NONE":
                this.currentLevel = LogLevel.NONE;
                break;
            case "ERROR":
                this.currentLevel = LogLevel.ERROR;
                break;
            case "WARN":
                this.currentLevel = LogLevel.WARN;
                break;
            case "INFO":
                this.currentLevel = LogLevel.INFO;
                break;
            case "DEBUG":
                this.currentLevel = LogLevel.DEBUG;
                break;
            default:
                // Default to INFO level if not specified or invalid.
                this.currentLevel = LogLevel.INFO;
                console.warn(
                    `LOG_LEVEL environment variable not set or invalid. Defaulting to INFO. Current value: ${logLevelEnv}`
                );
                break;
        }
        console.info(`Logger initialized with level: ${LogLevel[this.currentLevel]}`);
    }

    /**
     * Logs an error message.
     * @param args The messages or objects to log.
     */
    error(...args: any[]): void {
        if (this.currentLevel >= LogLevel.ERROR) {
            console.error("[ERROR]", ...args);
        }
    }

    /**
     * Logs a warning message.
     * @param args The messages or objects to log.
     */
    warn(...args: any[]): void {
        if (this.currentLevel >= LogLevel.WARN) {
            console.warn("[WARN]", ...args);
        }
    }

    /**
     * Logs an informational message.
     * @param args The messages or objects to log.
     */
    info(...args: any[]): void {
        if (this.currentLevel >= LogLevel.INFO) {
            console.info("[INFO]", ...args);
        }
    }

    /**
     * Logs a debug message.
     * @param args The messages or objects to log.
     */
    debug(...args: any[]): void {
        if (this.currentLevel >= LogLevel.DEBUG) {
            console.debug("[DEBUG]", ...args);
        }
    }
}

// Export a singleton instance of the Logger to be used throughout the application.
export const logger = new Logger();
