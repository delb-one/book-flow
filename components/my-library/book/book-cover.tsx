"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";

import { Card } from "@/components/ui/card";
import { CoverZoomDialog } from "@/components/my-library/book/cover-zoom-dialog";

type BookCoverProps = {
  covers: string[];
  fallbackCover: string | null;
  title: string;
};

export function BookCover({
  covers,
  fallbackCover,
  title,
}: BookCoverProps) {
  const items = useMemo(() => {
    const unique = new Set<string>();
    for (const cover of covers) {
      if (cover) unique.add(cover);
    }
    if (fallbackCover) unique.add(fallbackCover);
    return Array.from(unique);
  }, [covers, fallbackCover]);

  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const currentCover = items.length > 0 ? items[0] : null;

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
          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsZoomOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setIsZoomOpen(true);
              }
            }}
            className="group absolute inset-0 cursor-pointer"
            aria-label={`Apri zoom copertina di ${title}`}
          >
            <Image
              src={currentCover}
              alt={`Copertina di ${title}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/40">
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity group-hover:opacity-100">
                <ZoomIn className="size-4 " />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {currentCover ? (
        <CoverZoomDialog
          open={isZoomOpen}
          onOpenChange={setIsZoomOpen}
          covers={items}
          title={title}
        />
      ) : null}
    </div>
  );
}
