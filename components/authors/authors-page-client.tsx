"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search } from "lucide-react";

import type { LibraryBook } from "@/lib/library-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const PAGE_SIZE = 8;

const toneClass: Record<LibraryBook["coverTone"], string> = {
  amber: "from-amber-200 to-amber-400",
  emerald: "from-emerald-200 to-emerald-500",
  rose: "from-rose-200 to-rose-500",
  indigo: "from-indigo-200 to-indigo-500",
  cyan: "from-cyan-200 to-cyan-500",
  slate: "from-slate-200 to-slate-500",
};

type AuthorCard = {
  slug: string;
  name: string;
  books: LibraryBook[];
};

type AuthorsPageClientProps = {
  authors: AuthorCard[];
};

export function AuthorsPageClient({ authors }: AuthorsPageClientProps) {
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

      {filteredAuthors.length === 0 ? (
        <div className="rounded-lg border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
          Nessun autore trovato. Prova con un altro nome.
        </div>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {pagedAuthors.map((author) => (
              <Card
                key={author.slug}
                className="transition-all hover:shadow-sm"
              >
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <CardTitle className="line-clamp-1 text-xl">
                      {author.name}
                    </CardTitle>
                    <Badge variant="secondary">
                      {author.books.length} libri
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pb-6">
                  <div className="flex items-end gap-2">
                    {author.books.slice(0, 4).map((book, index) => {
                      const sizeClass = index === 0 ? "h-24 w-16" : "h-20 w-14";

                      return (
                        <div
                          key={book.id}
                          className={cn(
                            "relative overflow-hidden rounded-md bg-linear-to-br",
                            toneClass[book.coverTone],
                            sizeClass,
                          )}
                        >
                          {book.cover && (
                            <Image
                              src={book.cover}
                              alt={`Copertina di ${book.title}`}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-between"
                  >
                    <Link href={`/authors/${author.slug}`}>
                      Vedi Libri
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </section>

          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="text-sm text-muted-foreground">
              Pagina {currentPage} di {totalPages}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Precedente
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Successiva
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
