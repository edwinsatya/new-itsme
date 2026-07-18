"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import clsx from "clsx";
import FallbackArt, { type FallbackVariant } from "./FallbackArt";

type MediaSlotProps = {
  /** public path, or null when the file is known to be missing */
  src: string | null;
  alt: string;
  variant?: FallbackVariant;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** extra layer above the media (e.g. a multiply tint) */
  children?: ReactNode;
};

/**
 * An image slot that always paints something designed: the fallback art sits
 * underneath and the real image covers it once it loads. If the file errors
 * at runtime the art simply stays.
 */
export default function MediaSlot({
  src,
  alt,
  variant = "space",
  className,
  imgClassName,
  sizes,
  priority,
  children,
}: MediaSlotProps) {
  const [failed, setFailed] = useState(false);
  const showImage = !!src && !failed;

  return (
    <div
      className={clsx("relative overflow-hidden", className)}
      role={showImage ? undefined : "img"}
      aria-label={showImage ? undefined : alt}
    >
      <FallbackArt variant={variant} className="absolute inset-0" />
      {showImage && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={clsx("object-cover", imgClassName)}
          onError={() => setFailed(true)}
        />
      )}
      {children}
    </div>
  );
}
