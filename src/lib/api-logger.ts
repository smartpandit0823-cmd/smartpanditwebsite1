/**
 * API error logger - logs errors to console so you can see what's happening
 * Usage: in catch block: logApiError("/api/path", "POST", error);
 */
export function logApiError(path: string, method: string, error: unknown) {
  const err = error instanceof Error ? error : new Error(String(error));
  console.error(`\n[API ERROR] ${method} ${path}`);
  console.error("Message:", err.message);
  if (err.stack) {
    console.error("Stack:", err.stack);
  }
  if (error && typeof error === "object" && "cause" in error) {
    console.error("Cause:", (error as { cause: unknown }).cause);
  }
  console.error("---\n");
}
