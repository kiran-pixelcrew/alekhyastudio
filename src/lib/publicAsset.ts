import { existsSync, statSync } from "fs";
import { join } from "path";
import { unstable_noStore as noStore } from "next/cache";

/** Append file mtime+size so replaced public assets bust browser/Next caches. Server-only. */
export function publicAsset(path: string): string {
  noStore();

  if (!path.startsWith("/") || path.startsWith("//") || path.includes("://")) {
    return path;
  }

  try {
    const relative = path.split("?")[0].replace(/^\//, "");
    const full = join(process.cwd(), "public", relative);
    if (!existsSync(full)) return path;
    const stats = statSync(full);
    const stamp = `${Math.floor(stats.mtimeMs)}-${stats.size}`;
    return `${path.split("?")[0]}?v=${stamp}`;
  } catch {
    return path;
  }
}

export function withBustedSrc<T extends { src: string }>(items: T[]): T[] {
  return items.map((item) => ({ ...item, src: publicAsset(item.src) }));
}
