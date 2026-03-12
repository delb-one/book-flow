"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpDown,
  Grid3X3,
  List,
  Search,
  Star,
  Tag,
  User,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
// import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LibraryBook, ReadingStatus } from "@/lib/library-data";
import { slugify } from "@/lib/utils";
import { statusLabel, statusVariant } from "@/lib/library-status";

type ViewMode = "grid" | "table";
type StatusFilter = "all" | ReadingStatus;
type SortBy = "recent" | "title" | "rating" | "year";

const TABLE_PAGE_SIZE = 20;
const GRID_PAGE_SIZE = 24;





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

function CoverWithSkeleton({
  src,
  alt,
  width,
  height,
}: {
  src: string | null;
  alt: string;
  width: number;
  height: number;
}) {
  const [loaded, setLoaded] = useState(false);
  const showSkeleton = Boolean(src) && !loaded;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-md">
      {showSkeleton && (
        <div className="absolute inset-0 animate-pulse bg-muted" />
      )}
      {src && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          unoptimized
        />
      )}
    </div>
  );
}

export function MyLibraryClient({ books }: { books: LibraryBook[] }) {
  const [localBooks, setLocalBooks] = useState<LibraryBook[]>(books);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortBy>("recent");
  const [deleteTarget, setDeleteTarget] = useState<LibraryBook | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tablePage, setTablePage] = useState(1);
  const [gridPage, setGridPage] = useState(1);

  useEffect(() => {
    setLocalBooks(books);
  }, [books]);

  const uniqueCategories = useMemo(
    () => [...new Set(localBooks.flatMap((book) => book.categories))].sort(),
    [localBooks],
  );
  const uniqueAuthors = useMemo(
    () => [...new Set(localBooks.map((book) => book.author))].sort(),
    [localBooks],
  );

  const filteredBooks = useMemo(() => {
    const loweredQuery = query.trim().toLowerCase();

    const filtered = localBooks.filter((book) => {
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
  }, [authorFilter, localBooks, categoryFilter, query, sortBy, statusFilter]);

  const tableTotalPages = Math.max(
    1,
    Math.ceil(filteredBooks.length / TABLE_PAGE_SIZE),
  );
  const currentTablePage = Math.min(tablePage, tableTotalPages);

  const gridTotalPages = Math.max(
    1,
    Math.ceil(filteredBooks.length / GRID_PAGE_SIZE),
  );
  const currentGridPage = Math.min(gridPage, gridTotalPages);

  const pagedTableBooks = useMemo(() => {
    const start = (currentTablePage - 1) * TABLE_PAGE_SIZE;
    return filteredBooks.slice(start, start + TABLE_PAGE_SIZE);
  }, [currentTablePage, filteredBooks]);

  const pagedGridBooks = useMemo(() => {
    const start = (currentGridPage - 1) * GRID_PAGE_SIZE;
    return filteredBooks.slice(start, start + GRID_PAGE_SIZE);
  }, [currentGridPage, filteredBooks]);

  useEffect(() => {
    setTablePage(1);
    setGridPage(1);
  }, [authorFilter, categoryFilter, query, sortBy, statusFilter]);

  useEffect(() => {
    if (tablePage > tableTotalPages) {
      setTablePage(tableTotalPages);
    }
    if (gridPage > gridTotalPages) {
      setGridPage(gridTotalPages);
    }
  }, [gridPage, gridTotalPages, tablePage, tableTotalPages]);

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

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch("/api/library/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: deleteTarget.id }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setDeleteError(data?.error ?? "Errore durante la rimozione.");
        return;
      }

      setLocalBooks((prev) =>
        prev.filter((book) => book.id !== deleteTarget.id),
      );
      setDeleteTarget(null);
    } catch (error) {
      setDeleteError("Errore di rete durante la rimozione.");
      console.error("Errore di rete durante la rimozione.", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-1 min-h-0 flex-col gap-6 overflow-hidden">
        {" "}
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
              onValueChange={(value) => setStatusFilter(value as StatusFilter)}
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
                <SelectItem value="year">Ordina: anno pubblicazione</SelectItem>
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
        <div
          className={`min-h-0 flex-1 rounded-lg pr-4 ${
            viewMode === "table"
              ? "overflow-hidden"
              : "overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          }`}
        >
          {filteredBooks.length === 0 && (
            <div className="text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
              Nessun libro corrisponde ai filtri selezionati.
            </div>
          )}

          {filteredBooks.length > 0 && viewMode === "grid" && (
            <>
              <div className="pb-14">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
                  {pagedGridBooks.map((book) => (
                    <article
                      key={book.id}
                      className="group bg-card relative rounded-lg border shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-sm"
                    >
                      {book.status === "wishlist" && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          className="absolute right-3 top-3 z-1000 rounded-full  hover:bg-red-200 shadow-sm dark:bg-card dark:hover:bg-red-200  
               opacity-0 scale-90 transition-all duration-150
               group-hover:opacity-100 group-hover:scale-100"
                          onClick={() => {
                            setDeleteTarget(book);
                            setDeleteError(null);
                          }}
                          aria-label={`Rimuovi ${book.title} dalla wishlist`}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      )}
                      <Link
                        href={`/my-library/${slugify(book.title)}`}
                        className="block w-full cursor-pointer text-left"
                      >
                        <div className="mb-3 h-44 w-full">
                          <CoverWithSkeleton
                            src={book.cover}
                            alt={`Copertina di ${book.title}`}
                            width={256}
                            height={352}
                          />
                        </div>
                        <div className="p-2">
                          <p className="line-clamp-1 font-medium">
                            {book.title}
                          </p>
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
                        </div>
                        {/* {book.status === "reading" && (
                    <div className="space-y-1">
                      <Progress value={book.progress} />
                      <p className="text-muted-foreground text-xs">
                        {book.progress}% completato
                      </p>
                    </div>
                  )} */}
                      </Link>
                    </article>
                  ))}
                </div>
              </div>

              {gridTotalPages > 1 && (
                <div className="supports-backdrop-filter:bg-background/75 sticky bottom-0 z-10 border bg-background/95 px-3 py-2 backdrop-blur rounded-b-lg ">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-muted-foreground text-xs">
                      Pagina {currentGridPage} di {gridTotalPages}
                    </p>
                    <Pagination className="justify-end">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              setGridPage((prev) => Math.max(1, prev - 1))
                            }
                            disabled={currentGridPage === 1}
                            aria-disabled={currentGridPage === 1}
                          />
                        </PaginationItem>
                        {getVisiblePages(gridTotalPages, currentGridPage).map(
                          (item, index) =>
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
                                    setGridPage(item);
                                  }}
                                  isActive={item === currentGridPage}
                                >
                                  {item}
                                </PaginationLink>
                              </PaginationItem>
                            ),
                        )}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              setGridPage((prev) =>
                                Math.min(gridTotalPages, prev + 1),
                              )
                            }
                            disabled={currentGridPage === gridTotalPages}
                            aria-disabled={currentGridPage === gridTotalPages}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </div>
              )}
            </>
          )}

          {filteredBooks.length > 0 && viewMode === "table" && (
            <div className="max-h-full overflow-auto rounded-lg border [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <div className="pb-14">
                <table className="w-full min-w-230 text-left text-sm">
                  <thead className="sticky top-0 z-10 supports-backdrop-filter:bg-background/75 bg-background/95 px-3 backdrop-blur">
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
                    {pagedTableBooks.map((book) => (
                      <tr key={book.id} className="border-t">
                        <td className="px-3 py-2">
                          <div className="h-14 w-10">
                            <CoverWithSkeleton
                              src={book.cover}
                              alt={`Copertina di ${book.title}`}
                              width={40}
                              height={56}
                            />
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
                        <div className="flex items-center gap-2">
                          <Button asChild variant="ghost" size="sm">
                            <Link href={`/my-library/${slugify(book.title)}`}>
                              Dettagli
                            </Link>
                          </Button>
                          {book.status === "wishlist" && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon-sm"
                              className="hover:bg-red-200"
                              onClick={() => {
                                setDeleteTarget(book);
                                setDeleteError(null);
                              }}
                              aria-label={`Rimuovi ${book.title} dalla wishlist`}
                            >
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {tableTotalPages > 1 && (
                <div className="supports-backdrop-filter:bg-background/75 sticky bottom-0 z-10 border-t bg-background/95 px-3 py-2 backdrop-blur">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-muted-foreground text-xs">
                      Pagina {currentTablePage} di {tableTotalPages}
                    </p>
                    <Pagination className="justify-end">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              setTablePage((prev) => Math.max(1, prev - 1))
                            }
                            disabled={currentTablePage === 1}
                            aria-disabled={currentTablePage === 1}
                          />
                        </PaginationItem>
                        {getVisiblePages(tableTotalPages, currentTablePage).map(
                          (item, index) =>
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
                                    setTablePage(item);
                                  }}
                                  isActive={item === currentTablePage}
                                >
                                  {item}
                                </PaginationLink>
                              </PaginationItem>
                            ),
                        )}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              setTablePage((prev) =>
                                Math.min(tableTotalPages, prev + 1),
                              )
                            }
                            disabled={currentTablePage === tableTotalPages}
                            aria-disabled={currentTablePage === tableTotalPages}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <Dialog
          open={Boolean(deleteTarget)}
          onOpenChange={(open) => {
            if (!open) {
              setDeleteTarget(null);
              setDeleteError(null);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rimuovere dalla lista desideri?</DialogTitle>
              <DialogDescription>
                {deleteTarget
                  ? `Confermi di rimuovere "${deleteTarget.title}" dalla tua lista desideri?`
                  : "Confermi di rimuovere il libro dalla tua lista desideri?"}
              </DialogDescription>
            </DialogHeader>
            {deleteError && (
              <p className="text-sm text-destructive">{deleteError}</p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                Annulla
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Rimozione..." : "Rimuovi"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
