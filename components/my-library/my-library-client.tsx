"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpDown, Grid3X3, List, Search, Star, Tag, User, SlidersHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LibraryBook, ReadingStatus } from "@/lib/library-data";
import { slugify } from "@/lib/utils";

type ViewMode = "grid" | "table";
type StatusFilter = "all" | ReadingStatus;
type SortBy = "recent" | "title" | "rating" | "year";

export const toneClass: Record<string, string> = {
  amber: "from-amber-200 to-amber-400",
  emerald: "from-emerald-200 to-emerald-500",
  rose: "from-rose-200 to-rose-500",
  indigo: "from-indigo-200 to-indigo-500",
  cyan: "from-cyan-200 to-cyan-500",
  slate: "from-slate-200 to-slate-500",
};

export const statusLabel: Record<ReadingStatus, string> = {
  unread: "Non letto",
  reading: "In lettura",
  read: "Letto",
  wishlist: "Da comprare",
};

export const statusVariant: Record<
  ReadingStatus,
  "muted" | "warning" | "success" | "outline"
> = {
  unread: "muted",
  reading: "warning",
  read: "success",
  wishlist: "outline",
};

export function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < rating;
        return (
          <Star
            key={index}
            className={`size-3.5 ${filled ? "fill-amber-400 text-amber-400" : "text-muted-foreground/50"}`}
          />
        );
      })}
    </div>
  );
}

export function MyLibraryClient({ books }: { books: LibraryBook[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortBy>("recent");

  const uniqueCategories = useMemo(
    () => [...new Set(books.flatMap((book) => book.categories))].sort(),
    [books],
  );
  const uniqueAuthors = useMemo(
    () => [...new Set(books.map((book) => book.author))].sort(),
    [books],
  );

  const filteredBooks = useMemo(() => {
    const loweredQuery = query.trim().toLowerCase();

    const filtered = books.filter((book) => {
      const matchesQuery =
        loweredQuery.length === 0 ||
        book.title.toLowerCase().includes(loweredQuery) ||
        book.author.toLowerCase().includes(loweredQuery) ||
        book.categories.some((category) =>
          category.toLowerCase().includes(loweredQuery),
        );
      const matchesStatus =
        statusFilter === "all" || book.status === statusFilter;
      const matchesCategory =
        categoryFilter === "all" || book.categories.includes(categoryFilter);
      const matchesAuthor =
        authorFilter === "all" || book.author === authorFilter;

      return matchesQuery && matchesStatus && matchesCategory && matchesAuthor;
    });

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (sortBy === "recent") return a.addedAt < b.addedAt ? 1 : -1;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "rating") return b.rating - a.rating;
      return b.year - a.year;
    });

    return sorted;
  }, [authorFilter, books, categoryFilter, query, sortBy, statusFilter]);

  return (
    <div className="mx-auto w-full space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          La mia libreria
        </h1>
        <p className="text-muted-foreground">
          Gestisci i tuoi libri con vista griglia o tabella.
        </p>
      </header>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="pl-9"
                placeholder="Cerca titolo, autore o categoria..."
              />
            </div>

            <div className="inline-flex rounded-md border p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="size-4" />
                Griglia
              </Button>
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
              >
                <List className="size-4" />
                Tabella
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:flex-1 lg:flex-wrap lg:items-center">
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as StatusFilter)
                }
              >
                <SelectTrigger className="lg:w-50">
                  <SlidersHorizontal className="size-4 text-muted-foreground" />
                  <SelectValue placeholder="Stato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Stato: tutti</SelectItem>
                  <SelectItem value="unread">Non letti</SelectItem>
                  <SelectItem value="reading">In lettura</SelectItem>
                  <SelectItem value="read">Letto</SelectItem>
                  <SelectItem value="wishlist">Lista desideri</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={categoryFilter}
                onValueChange={(value) => setCategoryFilter(value)}
              >
                <SelectTrigger className="lg:w-50">
                  <Tag className="size-4 text-muted-foreground" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Categoria: tutte</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={authorFilter}
                onValueChange={(value) => setAuthorFilter(value)}
              >
                <SelectTrigger className="lg:w-50">
                  <User className="size-4 text-muted-foreground" />
                  <SelectValue placeholder="Autore" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Autore: tutti</SelectItem>
                  {uniqueAuthors.map((author) => (
                    <SelectItem key={author} value={author}>
                      {author}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="lg:shrink-0">
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as SortBy)}
              >
                <SelectTrigger className="lg:w-60">
                  <ArrowUpDown className="size-4 text-muted-foreground" />
                  <SelectValue placeholder="Ordina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">
                    Ordina: aggiunti di recente
                  </SelectItem>
                  <SelectItem value="title">Ordina: titolo</SelectItem>
                  <SelectItem value="rating">Ordina: valutazione</SelectItem>
                  <SelectItem value="year">
                    Ordina: anno pubblicazione
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <p className="text-muted-foreground text-sm">
              {filteredBooks.length} libri trovati
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery("");
                setStatusFilter("all");
                setCategoryFilter("all");
                setAuthorFilter("all");
                setSortBy("recent");
              }}
            >
              Reset filtri
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pb-6">
          {filteredBooks.length === 0 && (
            <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
              Nessun libro corrisponde ai filtri selezionati.
            </div>
          )}

          {filteredBooks.length > 0 && viewMode === "grid" && (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {filteredBooks.map((book) => (
                <article
                  key={book.id}
                  className="bg-card rounded-lg border p-3 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <Link
                    href={`/my-library/${slugify(book.title)}`}
                    className="block w-full cursor-pointer text-left"
                  >
                    <div className="mb-3 h-44 w-full overflow-hidden rounded-md">
                      {book.cover ? (
                        <Image
                          src={book.cover}
                          alt={`Copertina di ${book.title}`}
                          width={256}
                          height={352}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <div
                          className={`h-full w-full bg-linear-to-br ${toneClass[book.coverTone]}`}
                        />
                      )}
                    </div>
                    <p className="line-clamp-1 font-medium">{book.title}</p>
                    <p className="text-muted-foreground mb-2 text-sm">
                      {book.author}
                    </p>
                    <div className="mb-2 flex items-center justify-between">
                      <Badge variant={statusVariant[book.status]}>
                        {statusLabel[book.status]}
                      </Badge>
                      <RatingStars rating={book.rating} />
                    </div>
                    <div className="mb-2 flex flex-wrap gap-1">
                      {book.categories.slice(0, 2).map((category) => (
                        <Badge key={category} variant="outline">
                          {category}
                        </Badge>
                      ))}
                    </div>
                    {book.status === "reading" && (
                      <div className="space-y-1">
                        <Progress value={book.progress} />
                        <p className="text-muted-foreground text-xs">
                          {book.progress}% completato
                        </p>
                      </div>
                    )}
                  </Link>
                </article>
              ))}
            </div>
          )}

          {filteredBooks.length > 0 && viewMode === "table" && (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full min-w-230 text-left text-sm">
                <thead className="bg-muted/60">
                  <tr>
                    <th className="px-3 py-2 font-medium">Copertina</th>
                    <th className="px-3 py-2 font-medium">Titolo</th>
                    <th className="px-3 py-2 font-medium">Autore</th>
                    <th className="px-3 py-2 font-medium">Categorie</th>
                    <th className="px-3 py-2 font-medium">Valutazione</th>
                    <th className="px-3 py-2 font-medium">Stato</th>
                    <th className="px-3 py-2 font-medium">Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className="border-t">
                      <td className="px-3 py-2">
                        <div className="h-14 w-10 overflow-hidden rounded">
                          {book.cover ? (
                            <Image
                              src={book.cover}
                              alt={`Copertina di ${book.title}`}
                              width={40}
                              height={56}
                              className="h-full w-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <div
                              className={`h-full w-full bg-linear-to-br ${toneClass[book.coverTone]}`}
                            />
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <p className="font-medium">{book.title}</p>
                        <p className="text-muted-foreground text-xs">
                          {book.year || "-"}
                        </p>
                      </td>
                      <td className="px-3 py-2">{book.author}</td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-1">
                          {book.categories.map((category) => (
                            <Badge key={category} variant="outline">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <RatingStars rating={book.rating} />
                      </td>
                      <td className="px-3 py-2">
                        <Badge variant={statusVariant[book.status]}>
                          {statusLabel[book.status]}
                        </Badge>
                      </td>
                      <td className="px-3 py-2">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/my-library/${slugify(book.title)}`}>
                            Dettagli
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
