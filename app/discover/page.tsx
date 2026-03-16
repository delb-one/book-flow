"use client";

import { useEffect, useMemo, useState } from "react";

import { AddDialog } from "@/components/discover/add-dialog";
import { BookDetailsModal } from "@/components/discover/book-details-modal";
import { EmptyState } from "@/components/discover/empty-state";
import { RecommendationCard } from "@/components/discover/recommendation-card";
import { ResultsGrid } from "@/components/discover/results-grid";
import { ResultsTable } from "@/components/discover/results-table";
import { SearchCard } from "@/components/discover/search-card";
import type {
  AddStatus,
  SearchResult,
  ViewMode,
} from "@/components/discover/types";
import { Button } from "@/components/ui/button";
import { Grid3X3, List } from "lucide-react";

const TABLE_PAGE_SIZE = 20;
const GRID_PAGE_SIZE = 24;

export default function DiscoverPage() {
  // ── Search state (completamente indipendente) ──
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [tablePage, setTablePage] = useState(1);
  const [gridPage, setGridPage] = useState(1);

  // ── Recommendation state (completamente indipendente) ──
  const [recommendation, setRecommendation] = useState<SearchResult | null>(
    null,
  );
  const [recommendationReason, setRecommendationReason] = useState<
    string | null
  >(null);
  const [isRecommending, setIsRecommending] = useState(false);
  const [recommendationError, setRecommendationError] = useState<string | null>(
    null,
  );

  // ── Add/dialog state ──
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [status, setStatus] = useState<AddStatus>("unread");
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedBookIds, setSavedBookIds] = useState<Set<string>>(new Set());
  const [detailsBookId, setDetailsBookId] = useState<string | null>(null);

  // ── Debounce query ──
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  // ── Fetch recommendation on mount ──
  useEffect(() => {
    handleRecommend();
  }, []);

  // ── Search effect ──
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    let isCancelled = false;

    async function runSearch() {
      setIsLoading(true);
      setSearchError(null);

      try {
        const response = await fetch(
          `/api/open-library/search?q=${encodeURIComponent(debouncedQuery)}`,
        );
        const payload = (await response.json()) as {
          results?: SearchResult[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error || "Ricerca non disponibile.");
        }

        if (!isCancelled) {
          setSearchResults(payload.results ?? []);
        }
      } catch (error) {
        if (!isCancelled) {
          setSearchError(
            error instanceof Error
              ? error.message
              : "Errore durante la ricerca.",
          );
          setSearchResults([]);
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    runSearch();
    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery]);

  // ── Pagination helpers ──
  const tableTotalPages = Math.max(
    1,
    Math.ceil(searchResults.length / TABLE_PAGE_SIZE),
  );
  const currentTablePage = Math.min(tablePage, tableTotalPages);
  const gridTotalPages = Math.max(
    1,
    Math.ceil(searchResults.length / GRID_PAGE_SIZE),
  );
  const currentGridPage = Math.min(gridPage, gridTotalPages);

  const pagedTableResults = useMemo(() => {
    const start = (currentTablePage - 1) * TABLE_PAGE_SIZE;
    return searchResults.slice(start, start + TABLE_PAGE_SIZE);
  }, [currentTablePage, searchResults]);

  const pagedGridResults = useMemo(() => {
    const start = (currentGridPage - 1) * GRID_PAGE_SIZE;
    return searchResults.slice(start, start + GRID_PAGE_SIZE);
  }, [currentGridPage, searchResults]);

  useEffect(() => {
    setTablePage(1);
    setGridPage(1);
  }, [searchResults]);

  useEffect(() => {
    if (tablePage > tableTotalPages) setTablePage(tableTotalPages);
    if (gridPage > gridTotalPages) setGridPage(gridTotalPages);
  }, [gridPage, gridTotalPages, tablePage, tableTotalPages]);

  // ── Selected book (from search results OR recommendation) ──
  const selectedBook = useMemo(() => {
    if (!selectedBookId) return null;
    return (
      searchResults.find((r) => r.id === selectedBookId) ??
      (recommendation?.id === selectedBookId ? recommendation : null)
    );
  }, [searchResults, selectedBookId, recommendation]);

  // ── Details book (for modal) ──
  const detailsBook = useMemo(() => {
    if (!detailsBookId) return null;
    return (
      searchResults.find((r) => r.id === detailsBookId) ??
      (recommendation?.id === detailsBookId ? recommendation : null)
    );
  }, [searchResults, detailsBookId, recommendation]);

  // ── Recommendation fetch ──
  async function handleRecommend() {
    setIsRecommending(true);
    setRecommendationError(null);
    setRecommendationReason(null);
    setRecommendation(null);

    try {
      const response = await fetch("/api/recommendation");
      const payload = (await response.json()) as {
        result?: SearchResult;
        reason?: { category?: string; message?: string };
        error?: string;
      };

      if (!response.ok || !payload.result) {
        throw new Error(payload.error || "Impossibile trovare un consiglio.");
      }

      setRecommendation(payload.result);
      setRecommendationReason(
        payload.reason?.message ||
          (payload.reason?.category
            ? `Consiglio basato su: ${payload.reason.category}`
            : null),
      );
    } catch (error) {
      setRecommendationError(
        error instanceof Error
          ? error.message
          : "Errore durante la raccomandazione.",
      );
    } finally {
      setIsRecommending(false);
    }
  }

  // ── Add book ──
  async function handleAddBook() {
    if (!selectedBook) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      const response = await fetch("/api/library/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...selectedBook,
          authorKey: selectedBook.authorKey,
          status,
          rating,
          notes,
        }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        alreadyInLibrary?: boolean;
        error?: string;
        stage?: string;
        code?: string;
        message?: string;
        details?: string | null;
        hint?: string | null;
      };

      if (!response.ok || !payload.ok) {
        const parts = [
          payload.error || "Impossibile aggiungere il libro.",
          payload.stage ? `stage: ${payload.stage}` : "",
          payload.code ? `code: ${payload.code}` : "",
          payload.message ? `message: ${payload.message}` : "",
          payload.details ? `details: ${payload.details}` : "",
          payload.hint ? `hint: ${payload.hint}` : "",
        ].filter(Boolean);
        throw new Error(parts.join(" | "));
      }

      setSavedBookIds((prev) => new Set(prev).add(selectedBook.id));
      setSelectedBookId(null);
      setStatus("unread");
      setRating(0);
      setNotes("");
      setIsDialogOpen(false);
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Errore durante il salvataggio.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function openAddDialog(book: SearchResult) {
    setSaveError(null);
    setSelectedBookId(book.id);
    setStatus("unread");
    setRating(0);
    setNotes("");
    setIsDialogOpen(true);
  }

  function openDetailsModal(book: SearchResult) {
    setDetailsBookId(book.id);
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-1 min-h-0 flex-col gap-6">
        {/* Top row: search + recommendation side by side */}
        <div className="grid h-fit w-full grid-cols-1 gap-6 md:grid-cols-[2fr_2fr]">
          <SearchCard
            query={query}
            onQueryChange={setQuery}
            isLoading={isLoading}
            searchError={searchError}
            resultsCount={searchResults.length}
            // handleRecommend={handleRecommend}
          />

          {/* Recommendation panel */}
          {isRecommending ? (
            <RecommendationCardSkeleton />
          ) : recommendationError ? (
            <RecommendationErrorState
              error={recommendationError}
              onRetry={handleRecommend}
            />
          ) : recommendation ? (
            <RecommendationCard
              book={recommendation}
              reason={recommendationReason}
              onAddClick={openAddDialog}
              isSaved={savedBookIds.has(recommendation.id)}
              handleRecommend={handleRecommend}
            />
          ) : null}
        </div>

        {searchResults.length > 0 && (
          <div className="flex justify-between items-center">
            <div className="flex flex-col justify-between gap-3 pt-2">
              <p className="text-muted-foreground text-sm">
                {searchResults.length === 0 && ""}
                {searchResults.length > 0 &&
                  `${searchResults.length} risultati trovati`}
              </p>
            </div>

            <div className="mt-auto flex justify-end">
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
          </div>
        )}
        {/* Search results */}
        <div
          className={`min-h-0 flex-1 rounded-lg flex flex-col ${
            viewMode === "table"
              ? "overflow-hidden"
              : "overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          }`}
        >
          {searchResults.length > 0 && viewMode === "grid" && (
            <ResultsGrid
              results={pagedGridResults}
              savedBookIds={savedBookIds}
              currentPage={currentGridPage}
              totalPages={gridTotalPages}
              onPageChange={setGridPage}
              onAddClick={openAddDialog}
              onDetailsClick={openDetailsModal}
            />
          )}

          {searchResults.length > 0 && viewMode === "table" && (
            <ResultsTable
              results={pagedTableResults}
              savedBookIds={savedBookIds}
              currentPage={currentTablePage}
              totalPages={tableTotalPages}
              onPageChange={setTablePage}
              onAddClick={openAddDialog}
              onDetailsClick={openDetailsModal}
            />
          )}
        </div>

        <AddDialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setSelectedBookId(null);
              setSaveError(null);
            }
          }}
          selectedBook={selectedBook}
          status={status}
          onStatusChange={setStatus}
          rating={rating}
          onRatingChange={setRating}
          notes={notes}
          onNotesChange={setNotes}
          onConfirm={handleAddBook}
          isSaving={isSaving}
          saveError={saveError}
        />

        <BookDetailsModal
          book={detailsBook}
          open={!!detailsBookId}
          onOpenChange={(open) => {
            if (!open) {
              setDetailsBookId(null);
            }
          }}
        />

        <EmptyState
          show={
            !isLoading &&
            debouncedQuery.length >= 2 &&
            searchResults.length === 0 &&
            !searchError
          }
        />
      </div>
    </div>
  );
}

// ── Skeleton placeholder durante il caricamento ──
function RecommendationCardSkeleton() {
  return (
    <div className="relative flex items-center justify-between gap-6 overflow-hidden rounded-2xl bg-card px-8 py-7 shadow-xl animate-pulse">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="h-5 w-36 rounded-full bg-muted" />
        <div className="space-y-2">
          <div className="h-7 w-48 rounded bg-muted" />
          <div className="h-4 w-24 rounded bg-muted" />
        </div>
        <div className="space-y-1.5">
          <div className="h-3.5 w-full rounded bg-muted" />
          <div className="h-3.5 w-5/6 rounded bg-muted" />
          <div className="h-3.5 w-4/6 rounded bg-muted" />
        </div>
        <div className="mt-2 h-10 w-44 rounded-xl bg-muted" />
      </div>
      <div className="h-44 w-32 shrink-0 rounded-xl bg-muted" />
    </div>
  );
}

// ── Stato di errore con retry ──
function RecommendationErrorState({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-card px-8 py-7 text-center shadow-xl">
      <p className="text-sm text-red-400">{error}</p>
      <button
        onClick={onRetry}
        className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
      >
        Riprova
      </button>
    </div>
  );
}
