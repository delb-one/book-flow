"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";

import type { AuthorCard } from "@/types/authors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 8;

type AuthorsPageClientProps = {
  authors?: AuthorCard[];
};

export function AuthorsPageClient({
  authors: initialAuthors = [],
}: AuthorsPageClientProps) {
  const authors = initialAuthors;
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredAuthors = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return authors;
    return authors.filter((author) =>
      author.name.toLowerCase().includes(query),
    );
  }, [authors, search]);

  const totalPages = Math.max(1, Math.ceil(filteredAuthors.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pagedAuthors = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAuthors.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredAuthors]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function goToPage(nextPage: number) {
    const safePage = Math.min(Math.max(nextPage, 1), totalPages);
    setPage(safePage);
  }

  function getVisiblePages(total: number, current: number) {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 3) return [1, 2, 3, 4, "ellipsis", total] as const;
    if (current >= total - 2)
      return [1, "ellipsis", total - 3, total - 2, total - 1, total] as const;
    return [
      1,
      "ellipsis",
      current - 1,
      current,
      current + 1,
      "ellipsis",
      total,
    ] as const;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            type="search"
            placeholder="Cerca autore..."
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            aria-label="Cerca autore"
            className="pl-9"
          />
        </div>
      </div>
      <div className="text-sm text-muted-foreground">
        {filteredAuthors.length} autori trovati
      </div>
      <>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {pagedAuthors.map((author) => (
            <Link key={author.slug} href={`/authors/${author.slug}`}>
              <Card className="group h-full rounded-2xl border border-muted/70 bg-card/80 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <CardHeader className="items-center gap-2 pb-2 pt-6 text-center">
                  <div className="relative mx-auto size-20 overflow-hidden rounded-full border border-muted/60 bg-muted/40">
                    <Image
                      src={author.photoUrl ?? "/images/author-placeholder.svg"}
                      alt={`Ritratto di ${author.name}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <CardTitle className="line-clamp-1 text-lg font-semibold">
                    {author.name}
                  </CardTitle>
                  <div className="text-xs text-muted-foreground">
                    {author.bookCount} Libri
                  </div>
                </CardHeader>

                <CardContent className="pb-6">
                  <div className="flex items-end justify-center gap-2">
                    {author.covers.slice(0, 3).map((cover, index) => (
                      <div
                        key={`${author.id}-cover-${index}`}
                        className="relative h-16 w-11 overflow-hidden rounded-md border border-muted/60 bg-linear-to-br from-muted/40 to-muted/80"
                      >
                        {cover ? (
                          <Image
                            src={cover}
                            alt={`Copertina di ${author.name}`}
                            fill
                            className="object-cover"
                            sizes="44px"
                          />
                        ) : (
                          <div className="h-full w-full bg-muted/60" />
                        )}
                      </div>
                    ))}
                    {author.covers.length === 0 && (
                      <>
                        <div className="h-16 w-11 rounded-md border border-muted/60 bg-muted/50" />
                        <div className="h-16 w-11 rounded-md border border-muted/60 bg-muted/40" />
                        <div className="h-16 w-11 rounded-md border border-muted/60 bg-muted/30" />
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>

        {totalPages > 1 && (
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="text-xs text-muted-foreground w-full">
              Pagina {currentPage} di {totalPages}
            </div>

            <Pagination className="justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-disabled={currentPage === 1}
                  />
                </PaginationItem>
                {getVisiblePages(totalPages, currentPage).map((item, index) =>
                  item === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={item}>
                      <PaginationLink
                        href="#"
                        onClick={(event) => {
                          event.preventDefault();
                          goToPage(item);
                        }}
                        isActive={item === currentPage}
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  ),
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </>
    </div>
  );
}
