"use client";

import Image from "next/image";
import { useState } from "react";

interface CoverWithSkeletonProps {
  src: string | null;
  alt: string;
  width: number;
  height: number;
}

export function CoverWithSkeleton({
  src,
  alt,
  width,
  height,
}: CoverWithSkeletonProps) {
  const [loaded, setLoaded] = useState(false);
  const showSkeleton = Boolean(src) && !loaded;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-md">
      {showSkeleton && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
      {src && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          unoptimized
        />
      )}
    </div>
  );
}
