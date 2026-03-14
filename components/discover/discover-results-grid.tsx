"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaginationSticky } from "@/components/my-library/pagination-sticky";

import type { SearchResult } from "./types";

interface DiscoverResultsGridProps {
  results: SearchResult[];
  savedBookIds: Set<string>;
  onAddClick: (book: SearchResult) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function DiscoverResultsGrid({
  results,
  savedBookIds,
  onAddClick,
  currentPage,
  totalPages,
  onPageChange,
}: DiscoverResultsGridProps) {
  return (
    <>
      <div className="pb-14">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {results.map((book) => {
            const isSaved = savedBookIds.has(book.id);

            return (
              <Card key={book.id}>
                <CardHeader>
                  <div className="mb-2 flex gap-3">
                    <div className="bg-muted h-28 w-20 shrink-0 overflow-hidden rounded-md">
                      {book.cover ? (
                        <Image
                          src={book.cover}
                          alt={`Copertina di ${book.title}`}
                          className="h-full w-full object-cover"
                          width={80}
                          height={112}
                          unoptimized
                        />
                      ) : (
                        <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
                          No cover
                        </div>
                      )}
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
                    {(book.categories.length ? book.categories : ["Senza categoria"])
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
