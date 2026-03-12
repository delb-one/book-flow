"use client";

import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
}

export function RatingStars({ rating }: RatingStarsProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < rating;
        return (
          <Star
            key={index}
            className={`size-3.5 ${filled ? "fill-amber-400 text-amber-400" : "text-muted-foreground/50"}`}
          />
        );
      })}
    </div>
  );
}
