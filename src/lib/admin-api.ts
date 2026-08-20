import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { connectDb } from "@/lib/db";

export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    return {
      session: null as null,
      error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }),
    };
  }

  try {
    await connectDb();
  } catch (error) {
    console.error("Database connection failed:", error);
    return {
      session: null as null,
      error: NextResponse.json(
        { error: "Database unavailable." },
        { status: 503 },
      ),
    };
  }

  return { session, error: null };
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
