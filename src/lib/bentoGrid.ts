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

  if (aspect === "landscape") {
    // Wide stage frames need room; use featured so they match tall neighbor height.
    return index % 3 === 0 ? "bento-span-featured" : "bento-span-wide";
  }

  if (aspect === "portrait") {
    return index % 7 === 0 ? "bento-span-featured" : "bento-span-tall";
  }

  return index % 4 === 2 ? "bento-span-wide" : "bento-span-default";
}

export function getBentoImageClass(
  spanClass: string,
  aspect: BentoAspect,
  options?: { contain?: boolean },
) {
  if (options?.contain) {
    return "h-full min-h-full bg-charcoal/5";
  }

  // Bento tiles always fill their grid cell so the mosaic stays tight.
  if (spanClass) {
    return "h-full min-h-full";
  }

  if (aspect === "portrait") {
    return "aspect-[3/4]";
  }

  if (aspect === "square") {
    return "aspect-square";
  }

  return "aspect-[4/3]";
}

/**
 * Aspect-led mosaic for longer photography lists.
 * Every tile spans 2 rows so dense packing never leaves 1-row black holes.
 * Portraits stay tall (full height); landscapes get the larger featured cell.
 */
function getPhotographyBentoClass(_index: number, aspect: BentoAspect) {
  if (aspect === "landscape") {
    return "bento-span-featured";
  }

  return "bento-span-tall";
}

/**
 * Strict aspect tiles for invitations/creatives admin layout choice.
 * Portrait → tall column; landscape banners → full width so wide invites aren't cropped.
 */
export function getCreativeBentoClass(aspect: BentoAspect = "portrait") {
  if (aspect === "landscape") {
    return "bento-span-full";
  }
  return "bento-span-tall";
}

/** CSS aspect-ratio for invitation/creative frames (avoids object-cover cropping). */
export function getCreativeFrameStyle(item: {
  width?: number;
  height?: number;
  aspect?: BentoAspect;
}): { aspectRatio: string } {
  if (item.width && item.height && item.width > 0 && item.height > 0) {
    return { aspectRatio: `${item.width} / ${item.height}` };
  }
  if (item.aspect === "landscape") return { aspectRatio: "16 / 9" };
  if (item.aspect === "square") return { aspectRatio: "1" };
  return { aspectRatio: "3 / 4" };
}

const featuredLayouts: Record<number, string[]> = {
  4: [
    "bento-span-featured",
    "bento-span-tall",
    "bento-span-tall",
    "bento-span-featured",
  ],
  5: [
    "bento-span-featured",
    "bento-span-tall",
    "bento-span-tall",
    "bento-span-featured",
    "bento-span-tall",
  ],
  6: [
    "bento-span-featured",
    "bento-span-tall",
    "bento-span-tall",
    "bento-span-featured",
    "bento-span-tall",
    "bento-span-tall",
  ],
};

export function getFeaturedBentoClass(
  index: number,
  total: number,
  aspect: BentoAspect = "landscape",
) {
  // Longer galleries: size by photo aspect so subjects aren't crushed into short cells.
  if (total > 6) {
    return getPhotographyBentoClass(index, aspect);
  }

  const layout = featuredLayouts[total];
  if (layout?.[index]) {
    // Prefer aspect when the fixed slot would crush a portrait into a wide short cell.
    if (aspect === "portrait" && layout[index] === "bento-span-wide") {
      return "bento-span-tall";
    }
    if (aspect === "portrait" && layout[index] === "bento-span-featured") {
      return "bento-span-tall";
    }
    if (aspect === "landscape" && layout[index] === "bento-span-tall") {
      return "bento-span-featured";
    }
    return layout[index];
  }

  return getPhotographyBentoClass(index, aspect);
}
