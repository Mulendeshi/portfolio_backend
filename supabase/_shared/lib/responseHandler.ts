import { logExec } from "../services/loggingService.ts";

/**
 * Standard application response & error handler
 */
export class ResponseHandler extends Error {
    public readonly code: string;
    public readonly response: "Success" | "Failure";
    public readonly description: unknown;
    public readonly status: number;
    public readonly originalError?: Error;
    public readonly metadata?: Record<string, unknown>;

    constructor(
        code: string,
        response: "Success" | "Failure",
        message: string,
        status: number,
        description?: unknown,
        originalError?: Error,
        metadata?: Record<string, unknown>,
    ) {
        super(message);

        this.code = code;
        this.response = response;
        this.status = status;
        this.description = description ?? ERROR_CODES[code] ??
            "An error occurred";
        this.originalError = originalError;
        this.metadata = metadata;

        if (originalError?.stack) {
            this.stack = originalError.stack;
        }

        if (originalError) {
            logExec("ResponseHandler caught the error", {
                code,
                response,
                description,
                message,
                status,
                originalError: originalError,
                metadata,
            });
        }
    }

    toJSON() {
        return {
            code: this.code,
            response: this.response,
            message: this.message,
            description: this.description,
            status: this.status,
            originalError: this.originalError
                ? this.originalError.message
                : null,
            metadata: this.metadata,
        };
    }

    toResponse(logMessage?: string) {
        if (logMessage) {
            logExec(logMessage, this.toJSON());
        }

        return {
            code: this.code,
            response: this.response,
            message: this.message,
            description: this.description,
            status: this.status,
            originalError: this.originalError
                ? this.originalError.message
                : null,
            ...this.metadata
        };
    }
}

const ERROR_CODES: Record<string, string> = {
    "0": "Request successful",

    // Generic
    "05": "Invalid request",
    "06": "Unexpected server error",

    // Auth
    "11": "Unauthorized",
    "12": "Forbidden",
    "13": "Unknown user",

    // Validation
    "14": "Invalid input data",

    // DB / Supabase
    "15": "Resource not found",
    "18": "Database error",
};
