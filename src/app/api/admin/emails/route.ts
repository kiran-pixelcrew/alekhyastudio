import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { EmailLog } from "@/models/EmailLog";

export async function GET(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const filter =
    status === "sent" || status === "failed" ? { status } : {};

  const emails = await EmailLog.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ emails });
}
