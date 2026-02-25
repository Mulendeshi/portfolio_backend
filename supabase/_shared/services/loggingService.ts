/**
 * Structured logging for Supabase Edge Functions
 * Logs appear in Supabase Dashboard & CLI
 */

type Metadata = Record<string, unknown>;

const formatLog = (
  level: "INFO" | "ERROR",
  title: string,
  metadata?: Metadata,
) => ({
  level,
  title,
  timestamp: new Date().toISOString(),
  ...metadata,
});

/**
 * Logs normal execution flow
 */
export const logExec = (title: string, metadata: Metadata = {}) => {
  console.log(
    JSON.stringify(
      formatLog("INFO", title, {
        "metadata-message": (metadata as any)?.message,
        ...metadata,
      }),
    ),
  );
};

/**
 * Logs errors
 */
export const logError = (
  title: string,
  error: unknown,
  metadata: Metadata = {},
) => {
  const err =
    error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        }
      : error;

  console.error(
    JSON.stringify(
      formatLog("ERROR", title, {
        error: err,
        "metadata-message": (metadata as any)?.message,
        ...metadata,
      }),
    ),
  );
};
