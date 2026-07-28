import Image from "next/image";

type ImageWatermarkProps = {
  className?: string;
};

/** Soft logo mark over photos — decorative, not true DRM. */
export function ImageWatermark({ className }: ImageWatermarkProps) {
  return (
    <span
      aria-hidden
      className={[
        "pointer-events-none absolute z-[1] select-none drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]",
        className ??
          "bottom-2.5 right-2.5 opacity-55 md:bottom-3 md:right-3",
      ].join(" ")}
    >
      <Image
        src="/logo1.svg"
        alt=""
        width={120}
        height={17}
        className="h-3.5 w-auto md:h-4"
        unoptimized
        draggable={false}
      />
    </span>
  );
}
