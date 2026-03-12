"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { LibraryBook } from "@/lib/library-data";
import { BookSmallCard } from "@/components/dashboard/book-small-card";

const CARD_WIDTH_PX = 200;
const GAP_PX = 16;
const MAX_ROWS = 1;
const DEFAULT_COLUMNS = 5;

function getColumns(width: number) {
  return Math.max(1, Math.floor((width + GAP_PX) / (CARD_WIDTH_PX + GAP_PX)));
}

export function RecentlyAddedGrid({ books }: { books: LibraryBook[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setColumns(getColumns(entry.contentRect.width));
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const visibleCount = Math.min(books.length, columns * MAX_ROWS - 1);
  const visibleBooks = useMemo(
    () => books.slice(0, visibleCount),
    [books, visibleCount],
  );

  return (
    <div ref={containerRef}>
      <div className="flex flex-wrap gap-4">
        {visibleBooks.map((book) => (
          <BookSmallCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
