"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type CoverCarouselProps = {
  covers: string[];
  fallbackCover: string | null;
  title: string;
};

export function CoverCarousel({ covers, fallbackCover, title }: CoverCarouselProps) {
  const items = useMemo(() => {
    const unique = new Set<string>();
    for (const cover of covers) {
      if (cover) unique.add(cover);
    }
    if (fallbackCover) unique.add(fallbackCover);
    return Array.from(unique);
  }, [covers, fallbackCover]);

  const [index, setIndex] = useState(0);
  const total = items.length;

  const currentCover = total > 0 ? items[index] : null;

  function handlePrevious() {
    setIndex((prev) => (prev - 1 + total) % total);
  }

  function handleNext() {
    setIndex((prev) => (prev + 1) % total);
  }

  if (!currentCover) {
    return (
      <Card className="overflow-hidden">
        <div className="relative aspect-square w-full bg-muted sm:aspect-3/4">
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            Nessuna copertina
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      <Card className="overflow-hidden">
        <div className="relative aspect-square w-full bg-muted sm:aspect-3/4">
          <Image
            src={currentCover}
            alt={`Copertina di ${title}`}
            fill
            className="object-cover"
            priority
          />
        </div>
      </Card>
      {total > 1 ? (
        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" onClick={handlePrevious}>
            Indietro
          </Button>
          <span className="text-sm text-muted-foreground">
            {index + 1} / {total}
          </span>
          <Button type="button" variant="outline" onClick={handleNext}>
            Avanti
          </Button>
        </div>
      ) : null}
    </div>
  );
}
