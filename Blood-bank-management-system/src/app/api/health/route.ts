import { db } from "@/db";
import { sql } from "drizzle-orm";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, any> = {
    status: "ok",
    database: { connected: false },
    supabase: { configured: isSupabaseConfigured() },
    timestamp: new Date().toISOString(),
  };

  try {
    await db.execute(sql`select 1`);
    checks.database.connected = true;
    checks.database.driver = process.env.DATABASE_URL ? "postgresql" : "pglite";
  } catch (err) {
    checks.database.connected = false;
    checks.database.error = err instanceof Error ? err.message : "Unknown error";
    checks.status = "degraded";
  }

  const statusCode = checks.status === "ok" ? 200 : 503;
  return Response.json(checks, { status: statusCode });
}