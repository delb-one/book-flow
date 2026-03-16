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
import { Badge } from "@/components/ui/badge";

const statusLabel: Record<ReadingStatus, string> = {
  unread: "Non letto",
  reading: "In lettura",
  read: "Letto",
  wishlist: "Da comprare",
};

const allowedTransitions: Record<ReadingStatus, ReadingStatus[]> = {
  read: [],
  wishlist: ["read", "reading", "unread"],
  reading: ["read"],
  unread: ["read", "reading"],
};

export function BookControls({
  bookId,
  initialStatus,
  initialRating,
}: {
  bookId: string;
  initialStatus: ReadingStatus;
  initialRating: number;
}) {
  const [status, setStatus] = useState<ReadingStatus>(initialStatus);
  const [rating, setRating] = useState<number>(initialRating);
  const selectableStatuses = allowedTransitions[initialStatus];
  const selectableValue = selectableStatuses.includes(status)
    ? status
    : undefined;

  const updateLibraryBook = async (payload: {
    status?: ReadingStatus;
    rating?: number;
  }) => {
    try {
      const response = await fetch("/api/library/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, ...payload }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        console.error(data?.error ?? "Errore aggiornamento libro.");
      }
    } catch (error) {
      console.error("Errore di rete durante l'aggiornamento.", error);
    }
  };

  const handleStatusChange = (value: string) => {
    const nextStatus = value as ReadingStatus;
    setStatus(nextStatus);
    void updateLibraryBook({ status: nextStatus });
  };

  const handleRatingChange = (value: number) => {
    setRating(value);
    void updateLibraryBook({ rating: value });
  };

  return (
    <div className="space-y-4 flex flex-row sm:flex-col items-start gap-4 justify-between">
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
          Stato lettura
        </p>
        {initialStatus === "read" ? (
          <Badge variant="success">{statusLabel.read}</Badge>
        ) : (
          <Select value={selectableValue} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue
                placeholder={`Attuale: ${statusLabel[initialStatus]}`}
              />
            </SelectTrigger>
            <SelectContent>
              {selectableStatuses.map((nextStatus) => (
                <SelectItem key={nextStatus} value={nextStatus}>
                  {statusLabel[nextStatus]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
          Valutazione
        </p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 group">
            {Array.from({ length: 5 }, (_, index) => {
              const value = index + 1;
              const filled = value <= rating;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleRatingChange(value)}
                  aria-label={`Valuta ${value} su 5`}
                  className="cursor-pointer transition-transform duration-150 hover:scale-110 hover:drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]"
                >
                  <Star
                    className={`
              size-4 transition-all duration-150
              ${
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/40"
              }
              group-hover:text-amber-300
            `}
                  />
                </button>
              );
            })}
          </div>

          <span className="text-sm font-medium">
            {rating ? rating + "/5" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
