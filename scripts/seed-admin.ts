/**
 * Create or update the admin user.
 *
 * Usage:
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='strong-password' npm run seed:admin
 *
 * Requires MONGODB_URI and AUTH_SECRET in .env.local (or environment).
 */
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "";
  const name = (process.env.ADMIN_NAME ?? "Admin").trim();

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required.");
  }
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required.");
  }
  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
  }

  const { connectDb } = await import("../src/lib/db");
  const { hashPassword } = await import("../src/lib/auth");
  const { Admin } = await import("../src/models/Admin");

  await connectDb();
  const passwordHash = await hashPassword(password);

  const admin = await Admin.findOneAndUpdate(
    { email },
    { email, name, passwordHash },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  console.log(`Admin ready: ${admin.email} (${admin.name})`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
