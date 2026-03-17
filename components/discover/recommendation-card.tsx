"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";

import type { SearchResult } from "./types";
import { RotateCcw, ZoomIn } from "lucide-react";

interface RecommendationCardProps {
  book: SearchResult;
  reason: string | null;
  onAddClick: (book: SearchResult) => void;
  isSaved: boolean;
  handleRecommend: () => void;
  onDetailsClick: (book: SearchResult) => void;
}

export function RecommendationCard({
  book,
  reason,
  onAddClick,
  handleRecommend,
  isSaved,
  onDetailsClick,
}: RecommendationCardProps) {
  return (
    <div className="relative flex items-center justify-between gap-6 overflow-hidden rounded-2xl bg-card px-8 py-7 shadow-xl">
      {/* Left content */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex justify-between items-center">
          {/* Badge */}
          <span className="w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
            Consigliato per te
          </span>
        </div>

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
        <div className="mt-2 flex items-center justify-between gap-2">
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

          <Button
            size="lg"
            variant="outline" // o secondary
            onClick={handleRecommend}
            className="rounded-xl px-6 font-semibold"
          >
            <RotateCcw />
            Consigliane un altro
          </Button>
        </div>
      </div>

      {/* Right cover */}
      <div
        className="bg-muted relative h-44 w-32 overflow-hidden rounded-md group cursor-pointer"
        onClick={() => onDetailsClick(book)}
      >
        {book.cover ? (
          <Image
            src={book.cover}
            alt={`Copertina di ${book.title}`}
            className="h-full w-full object-cover"
            width={48}
            height={64}
            unoptimized
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center text-[10px]">
            No cover
          </div>
        )}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="size-4 text-white" />
        </div>
      </div>
    </div>
  );
}
