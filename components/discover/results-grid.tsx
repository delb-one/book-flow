"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaginationSticky } from "@/components/my-library/pagination-sticky";

import type { SearchResult } from "./types";
import { ZoomIn } from "lucide-react";

interface ResultsGridProps {
  results: SearchResult[];
  savedBookIds: Set<string>;
  onAddClick: (book: SearchResult) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDetailsClick: (book: SearchResult) => void;
}

export function ResultsGrid({
  results,
  savedBookIds,
  onAddClick,
  currentPage,
  totalPages,
  onPageChange,
  onDetailsClick,
}: ResultsGridProps) {
  return (
    <>
      <div className="pb-14">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {results.map((book) => {
            const isSaved = savedBookIds.has(book.id);

            return (
              <Card key={book.id} className="flex justify-between">
                <CardHeader>
                  <div className="mb-2 flex gap-3">
                    <div
                      className="bg-muted relative h-16 w-12 overflow-hidden rounded-md group cursor-pointer"
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
                    <div className="min-w-0 space-y-1">
                      <CardTitle className="line-clamp-2 text-lg">
                        {book.title}
                      </CardTitle>
                      <p className="text-muted-foreground line-clamp-1 text-sm">
                        {book.author}
                      </p>
                      <div className="text-muted-foreground flex flex-wrap gap-2 text-xs">
                        {book.year && <span>{book.year}</span>}
                        {book.publisher && <span>{book.publisher}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(book.categories.length
                      ? book.categories
                      : ["Senza categoria"]
                    )
                      .slice(0, 3)
                      .map((category) => (
                        <Badge key={category} variant="outline">
                          {category}
                        </Badge>
                      ))}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pb-6">
                  <Button
                    onClick={() => {
                      if (isSaved) return;
                      onAddClick(book);
                    }}
                    variant={isSaved ? "secondary" : "default"}
                    disabled={isSaved}
                    className="w-full"
                  >
                    {isSaved
                      ? "Già aggiunto in questa sessione"
                      : "Aggiungi alla libreria"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </div>
      <PaginationSticky
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
}
