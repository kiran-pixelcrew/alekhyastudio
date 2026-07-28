import { existsSync, statSync } from "fs";
import { join } from "path";
import { unstable_noStore as noStore } from "next/cache";

export type HeroSlide = {
  id: string;
  desktop: string;
  mobile: string;
  alt: string;
  /** CSS object-position for desktop crop (e.g. "62% center") */
  desktopPosition?: string;
  /** CSS object-position for mobile crop */
  mobilePosition?: string;
};

function withCacheBust(publicPath: string) {
  try {
    const full = join(process.cwd(), "public", publicPath);
    if (!existsSync(full)) return publicPath;
    const stats = statSync(full);
    const stamp = `${Math.floor(stats.mtimeMs)}-${stats.size}`;
    return `${publicPath}?v=${stamp}`;
  } catch {
    return publicPath;
  }
}

function slide(
  n: number,
  alt: string,
  positions?: Pick<HeroSlide, "desktopPosition" | "mobilePosition">,
): HeroSlide {
  const desktop = withCacheBust(`/images/hero/img${n}.webp`);
  const mobilePath = `/images/hero/Mimg${n}.webp`;
  const mobileFull = join(process.cwd(), "public", mobilePath);
  const mobile = existsSync(mobileFull)
    ? withCacheBust(mobilePath)
    : desktop;

  return {
    id: String(n),
    desktop,
    mobile,
    alt,
    ...positions,
  };
}

/** Call from a Server Component so file mtimes bust browser/Next image cache. */
export function getHeroSlides(): HeroSlide[] {
  noStore();

  return [
    slide(1, "Classical dancer in traditional costume performing on stage", {
      desktopPosition: "62% center",
    }),
    slide(2, "Bharatanatyam performance captured in warm stage light"),
    slide(3, "Indian classical dance ensemble in formation"),
    slide(4, "Expressive classical dance portrait with traditional attire"),
    slide(5, "Young dancer in classical costume mid-performance"),
    slide(6, "Classical dance performance under dramatic stage lighting"),
    slide(7, "Ensemble of dancers performing on stage"),
  ];
}
