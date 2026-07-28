export type BentoAspect = "portrait" | "landscape" | "square";

type BentoItemOptions = {
  aspect: BentoAspect;
  index: number;
  total: number;
  fullWidth?: boolean;
};

export function getBentoItemClass({
  aspect,
  index,
  total,
  fullWidth = false,
}: BentoItemOptions) {
  if (fullWidth || total === 1) {
    return "bento-span-full";
  }

  if (index % 7 === 0) {
    return "bento-span-featured";
  }

  if (aspect === "landscape") {
    return index % 3 === 1 ? "bento-span-featured" : "bento-span-wide";
  }

  if (aspect === "portrait") {
    return "bento-span-tall";
  }

  return index % 4 === 2 ? "bento-span-wide" : "bento-span-default";
}

export function getBentoImageClass(
  spanClass: string,
  aspect: BentoAspect,
  options?: { contain?: boolean },
) {
  if (options?.contain) {
    return "h-full min-h-[220px] bg-charcoal/5";
  }

  if (spanClass.includes("featured")) {
    return "h-full min-h-[280px] sm:min-h-[420px]";
  }

  if (spanClass.includes("tall")) {
    return "h-full min-h-[320px] sm:min-h-[460px]";
  }

  if (spanClass.includes("wide")) {
    return "h-full min-h-[220px] sm:min-h-[260px]";
  }

  if (aspect === "portrait") {
    return "aspect-[3/4]";
  }

  if (aspect === "square") {
    return "aspect-square";
  }

  return "aspect-[4/3]";
}

const featuredLayouts: Record<number, string[]> = {
  4: [
    "bento-span-featured",
    "bento-span-wide",
    "bento-span-default",
    "bento-span-tall",
  ],
  5: [
    "bento-span-featured",
    "bento-span-wide",
    "bento-span-default",
    "bento-span-tall",
    "bento-span-wide",
  ],
  6: [
    "bento-span-featured",
    "bento-span-wide",
    "bento-span-default",
    "bento-span-tall",
    "bento-span-wide",
    "bento-span-default",
  ],
};

export function getFeaturedBentoClass(
  index: number,
  total: number,
  aspect: BentoAspect = "landscape",
) {
  const layout = featuredLayouts[total];
  if (layout?.[index]) {
    return layout[index];
  }

  return getBentoItemClass({
    aspect,
    index,
    total,
  });
}
