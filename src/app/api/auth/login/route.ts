import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Admin } from "@/models/Admin";
import {
  createSessionToken,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/auth";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const email =
    typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  const password = typeof data.password === "string" ? data.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 },
    );
  }

  try {
    await connectDb();
  } catch (error) {
    console.error("Login DB error:", error);
    return NextResponse.json(
      { error: "Database unavailable." },
      { status: 503 },
    );
  }

  const admin = await Admin.findOne({ email }).lean();
  if (!admin) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  const token = await createSessionToken({
    sub: String(admin._id),
    email: admin.email,
    name: admin.name,
  });

  const response = NextResponse.json({
    ok: true,
    admin: { email: admin.email, name: admin.name },
  });
  response.cookies.set(sessionCookieOptions(token));
  return response;
}
