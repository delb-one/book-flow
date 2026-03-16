"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";

import type { SearchResult } from "./types";

interface RecommendationCardProps {
  book: SearchResult;
  reason: string | null;
  onAddClick: (book: SearchResult) => void;
  isSaved: boolean;
}

export function RecommendationCard({
  book,
  reason,
  onAddClick,
  isSaved,
}: RecommendationCardProps) {
  return (
    <div className="relative flex items-center justify-between gap-6 overflow-hidden rounded-2xl bg-card px-8 py-7 shadow-xl">
      {/* Left content */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {/* Badge */}
        <span className="w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
          Consigliato per te
        </span>

        {/* Title & Author */}
        <div>
          <h2 className="text-3xl font-bold leading-tight">{book.title}</h2>
          <p className="mt-1 text-sm ">di {book.author}</p>
        </div>

        {/* Description / reason */}
        {(book.description || reason) && (
          <p className="line-clamp-3 max-w-md text-sm leading-relaxed ">
            {reason ?? book.description}
          </p>
        )}

        {/* Button */}
        <div className="mt-2">
          <Button
            onClick={() => {
              if (isSaved) return;
              onAddClick(book);
            }}
            disabled={isSaved}
            variant={isSaved ? "secondary" : "default"}
            size="lg"
            className="rounded-xl px-6 font-semibold"
          >
            {isSaved
              ? "Già aggiunto in questa sessione"
              : "Aggiungi alla libreria"}
          </Button>
        </div>
      </div>

      {/* Right cover */}
      <div className="relative h-44 w-32 shrink-0 overflow-hidden rounded-xl shadow-2xl">
        {book.cover ? (
          <Image
            src={book.cover}
            alt={`Copertina di ${book.title}`}
            className="h-full w-full object-cover"
            width={128}
            height={176}
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-700 text-xs text-slate-400">
            No cover
          </div>
        )}
      </div>
    </div>
  );
}
