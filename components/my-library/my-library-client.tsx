"use client";

import { useEffect, useMemo, useState } from "react";

import type { LibraryBook, ReadingStatus } from "@/lib/library-data";

import { BookCard } from "./book-card";
import { BookTableRow } from "./book-table-row";
import { FilterBar } from "./filter-bar";
import { PaginationSticky } from "./pagination-sticky";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";

type ViewMode = "grid" | "table";
type StatusFilter = "all" | ReadingStatus;
type SortBy = "recent" | "title" | "rating" | "year";

const TABLE_PAGE_SIZE = 20;
const GRID_PAGE_SIZE = 24;

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
      <div className="flex flex-1 min-h-0 flex-col gap-6">
        <FilterBar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          query={query}
          onQueryChange={setQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          authorFilter={authorFilter}
          onAuthorFilterChange={setAuthorFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          uniqueCategories={uniqueCategories}
          uniqueAuthors={uniqueAuthors}
          filteredBooksCount={filteredBooks.length}
          onReset={() => {
            setQuery("");
            setStatusFilter("all");
            setCategoryFilter("all");
            setAuthorFilter("all");
            setSortBy("recent");
          }}
        />
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
                    <BookCard
                      key={book.id}
                      book={book}
                      onDeleteClick={(book) => {
                        setDeleteTarget(book);
                        setDeleteError(null);
                      }}
                    />
                  ))}
                </div>
              </div>

              <PaginationSticky
                currentPage={currentGridPage}
                totalPages={gridTotalPages}
                onPageChange={setGridPage}
              />
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
                      <BookTableRow
                        key={book.id}
                        book={book}
                        onDeleteClick={(book) => {
                          setDeleteTarget(book);
                          setDeleteError(null);
                        }}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <PaginationSticky
                currentPage={currentTablePage}
                totalPages={tableTotalPages}
                onPageChange={setTablePage}
              />
            </div>
          )}
        </div>
        <DeleteConfirmationDialog
          open={Boolean(deleteTarget)}
          onOpenChange={(open) => {
            if (!open) {
              setDeleteTarget(null);
              setDeleteError(null);
            }
          }}
          bookTitle={deleteTarget?.title}
          isDeleting={isDeleting}
          error={deleteError}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  );
}
