/**
 * Next.js Instrumentation File
 * Runs ONCE when the server starts — before any requests arrive.
 * We use this to warm up the MongoDB connection so the FIRST
 * user request is not slow due to a cold DB connection.
 *
 * Docs: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
    // Only run on the Node.js runtime (not Edge)
    if (process.env.NEXT_RUNTIME === "nodejs") {
        console.log("🔥 [Instrumentation] Warming up MongoDB connection...");
        try {
            const { connectDB } = await import("@/lib/db/mongodb");
            await connectDB();
            console.log("✅ [Instrumentation] MongoDB warm — ready for requests!");
        } catch (e) {
            // Non-fatal: server still starts, DB retried on first request
            console.warn("⚠️ [Instrumentation] MongoDB warmup failed:", (e as Error).message);
        }
    }
}
