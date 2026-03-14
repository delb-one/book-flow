"use client";

import { useEffect, useMemo, useState } from "react";

import { AddDialog } from "@/components/discover/add-dialog";
import { EmptyState } from "@/components/discover/empty-state";
import { ResultsGrid } from "@/components/discover/results-grid";
import { ResultsTable } from "@/components/discover/results-table";
import { SearchCard } from "@/components/discover/search-card";
import type { AddStatus, SearchResult, ViewMode } from "@/components/discover/types";

const TABLE_PAGE_SIZE = 20;
const GRID_PAGE_SIZE = 24;

export default function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isRecommendationMode, setIsRecommendationMode] = useState(false);
  const [isRecommending, setIsRecommending] = useState(false);
  const [recommendationError, setRecommendationError] = useState<string | null>(
    null,
  );
  const [recommendationReason, setRecommendationReason] = useState<
    string | null
  >(null);

  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [status, setStatus] = useState<AddStatus>("unread");
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedBookIds, setSavedBookIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [tablePage, setTablePage] = useState(1);
  const [gridPage, setGridPage] = useState(1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (isRecommendationMode) return;

    if (debouncedQuery.length < 2) {
      setResults([]);
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
          setResults(payload.results ?? []);
        }
      } catch (error) {
        if (!isCancelled) {
          const message =
            error instanceof Error
              ? error.message
              : "Errore durante la ricerca.";
          setSearchError(message);
          setResults([]);
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    runSearch();
    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery, isRecommendationMode]);

  const selectedBook = useMemo(
    () => results.find((result) => result.id === selectedBookId) ?? null,
    [results, selectedBookId],
  );

  const tableTotalPages = Math.max(
    1,
    Math.ceil(results.length / TABLE_PAGE_SIZE),
  );
  const currentTablePage = Math.min(tablePage, tableTotalPages);

  const gridTotalPages = Math.max(
    1,
    Math.ceil(results.length / GRID_PAGE_SIZE),
  );
  const currentGridPage = Math.min(gridPage, gridTotalPages);

  const pagedTableResults = useMemo(() => {
    const start = (currentTablePage - 1) * TABLE_PAGE_SIZE;
    return results.slice(start, start + TABLE_PAGE_SIZE);
  }, [currentTablePage, results]);

  const pagedGridResults = useMemo(() => {
    const start = (currentGridPage - 1) * GRID_PAGE_SIZE;
    return results.slice(start, start + GRID_PAGE_SIZE);
  }, [currentGridPage, results]);

  useEffect(() => {
    setTablePage(1);
    setGridPage(1);
  }, [results]);

  useEffect(() => {
    if (tablePage > tableTotalPages) {
      setTablePage(tableTotalPages);
    }
    if (gridPage > gridTotalPages) {
      setGridPage(gridTotalPages);
    }
  }, [gridPage, gridTotalPages, tablePage, tableTotalPages]);

  async function handleAddBook() {
    if (!selectedBook) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      const response = await fetch("/api/library/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      const message =
        error instanceof Error
          ? error.message
          : "Errore durante il salvataggio.";
      setSaveError(message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleRecommend() {
    setIsRecommending(true);
    setRecommendationError(null);
    setSearchError(null);
    setRecommendationReason(null);

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

      setIsRecommendationMode(true);
      setQuery("");
      setResults([payload.result]);
      setRecommendationReason(
        payload.reason?.message ||
          (payload.reason?.category
            ? `Consiglio basato su: ${payload.reason.category}`
            : null),
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Errore durante la raccomandazione.";
      setRecommendationError(message);
      setResults([]);
    } finally {
      setIsRecommending(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-1 min-h-0 flex-col gap-6">
        <SearchCard
          query={query}
          onQueryChange={(value) => {
            setIsRecommendationMode(false);
            setRecommendationReason(null);
            setRecommendationError(null);
            setQuery(value);
          }}
          onRecommend={handleRecommend}
          isLoading={isLoading}
          isRecommending={isRecommending}
          searchError={searchError}
          recommendationError={recommendationError}
          recommendationReason={recommendationReason}
          resultsCount={results.length}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <div
          className={`min-h-0 flex-1 rounded-lg pr-4 ${
            viewMode === "table"
              ? "overflow-hidden"
              : "overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          }`}
        >
          {results.length > 0 && viewMode === "grid" && (
            <ResultsGrid
              results={pagedGridResults}
              savedBookIds={savedBookIds}
              currentPage={currentGridPage}
              totalPages={gridTotalPages}
              onPageChange={setGridPage}
              onAddClick={(book) => {
                setSaveError(null);
                setSelectedBookId(book.id);
                setStatus("unread");
                setRating(0);
                setNotes("");
                setIsDialogOpen(true);
              }}
            />
          )}

          {results.length > 0 && viewMode === "table" && (
            <ResultsTable
              results={pagedTableResults}
              savedBookIds={savedBookIds}
              currentPage={currentTablePage}
              totalPages={tableTotalPages}
              onPageChange={setTablePage}
              onAddClick={(book) => {
                setSaveError(null);
                setSelectedBookId(book.id);
                setStatus("unread");
                setRating(0);
                setNotes("");
                setIsDialogOpen(true);
              }}
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

        <EmptyState
          show={
            !isLoading &&
            !isRecommendationMode &&
            debouncedQuery.length >= 2 &&
            results.length === 0 &&
            !searchError
          }
        />
      </div>
    </div>
  );
}
