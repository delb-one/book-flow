"use client";

import { useState } from "react";
import { Star } from "lucide-react";

import type { ReadingStatus } from "@/lib/library-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusLabel: Record<ReadingStatus, string> = {
  unread: "Non letto",
  reading: "In lettura",
  read: "Letto",
  wishlist: "Da comprare",

};

export function MyLibraryBookControls({
  initialStatus,
  initialRating,
}: {
  initialStatus: ReadingStatus;
  initialRating: number;
}) {
  const [status, setStatus] = useState<ReadingStatus>(initialStatus);
  const [rating, setRating] = useState<number>(initialRating);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
          Stato lettura
        </p>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as ReadingStatus)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Scegli stato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unread">{statusLabel.unread}</SelectItem>
            <SelectItem value="reading">{statusLabel.reading}</SelectItem>
            <SelectItem value="read">{statusLabel.read}</SelectItem>
            <SelectItem value="wishlist">{statusLabel.wishlist}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
          Valutazione
        </p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, index) => {
              const value = index + 1;
              const filled = value <= rating;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  aria-label={`Valuta ${value} su 5`}
                  className="transition-transform hover:scale-105"
                >
                  <Star
                    className={`size-4 ${filled ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`}
                  />
                </button>
              );
            })}
          </div>
          <span className="text-sm font-medium">{rating} / 5</span>
        </div>
      </div>
    </div>
  );
}
