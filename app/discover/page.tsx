"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bookmark,
  BookOpen,
  CheckCircle2,
  Loader2,
  Search,
  Star,
} from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type SearchResult = {
  id: string;
  title: string;
  author: string;
  year: number | null;
  publisher: string | null;
  pages: number | null;
  cover: string | null;
  categories: string[];
  description: string;
  source: "openlibrary";
};

type AddStatus = "unread" | "reading" | "read" | "wishlist";

export default function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [status, setStatus] = useState<AddStatus>("unread");
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedBookIds, setSavedBookIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 400);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
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
  }, [debouncedQuery]);

  const selectedBook = useMemo(
    () => results.find((result) => result.id === selectedBookId) ?? null,
    [results, selectedBookId],
  );

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

  return (
    <div className="mx-auto w-full space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Scopri libri</h1>
        <p className="text-muted-foreground">
          Cerca su Open Library e aggiungi nuovi libri alla tua libreria
          personale.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Ricerca</CardTitle>
          <CardDescription>
            Inserisci titolo o autore (minimo 2 caratteri)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pb-6">
          <div className="relative w-full max-w-xl flex items-center gap-2">
            <div>
              <Search className="text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="pl-8"
                placeholder="Es. Dune, Calvino, Tolkien..."
              />
            </div>
            <Button>Consigliami un libro</Button>
          </div>

          {isLoading && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Loader2 className="size-4 animate-spin" />
              Ricerca in corso...
            </div>
          )}

          {searchError && (
            <p className="text-destructive text-sm">{searchError}</p>
          )}
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                    setSaveError(null);
                    setSelectedBookId(book.id);
                    setStatus("unread");
                    setRating(0);
                    setNotes("");
                    setIsDialogOpen(true);
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

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setSelectedBookId(null);
            setSaveError(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-primary bg-primary/10 flex size-9 items-center justify-center rounded-lg">
                <Bookmark className="size-4" />
              </div>
              <DialogTitle>Aggiungi alla libreria</DialogTitle>
            </div>
          </div>

          <div className="space-y-6 px-6 py-5">
            {selectedBook && (
              <div className="flex gap-4">
                <div className="bg-muted h-28 w-20 shrink-0 overflow-hidden rounded-lg">
                  {selectedBook.cover ? (
                    <Image
                      src={selectedBook.cover}
                      alt={`Copertina di ${selectedBook.title}`}
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
                <div className="space-y-1">
                  <p className="text-base font-semibold">
                    {selectedBook.title}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {selectedBook.author}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {(selectedBook.categories.length
                      ? selectedBook.categories
                      : ["Senza categoria"]
                    )
                      .slice(0, 2)
                      .map((category) => (
                        <Badge key={category} variant="outline">
                          {category}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                Stato lettura
              </p>
              <div className="grid gap-2 sm:grid-cols-4">
                {[
                  { value: "unread", label: "Non letto", icon: BookOpen },
                  { value: "reading", label: "In lettura", icon: BookOpen },
                  { value: "read", label: "Letto", icon: CheckCircle2 },
                  { value: "wishlist", label: "Da comprare", icon: Bookmark },
                ].map(({ value, label, icon: Icon }) => {
                  const isActive = status === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setStatus(value as AddStatus)}
                      className={`border-input flex flex-col items-center gap-2 rounded-lg border px-3 py-3 text-xs font-medium transition cursor-pointer ${
                        isActive
                          ? "bg-primary/10 text-primary border-primary/40 shadow-sm"
                          : "bg-background text-foreground/80 hover:border-primary/30"
                      }`}
                    >
                      <Icon className="size-4" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                La tua valutazione
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 group">
                  {Array.from({ length: 5 }, (_, index) => {
                    const value = index + 1;
                    const filled = value <= rating;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        aria-label={`Valuta ${value} su 5`}
                        className="cursor-pointer transition-transform duration-150 hover:scale-110 hover:drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]"
                      >
                        <Star
                          className={`
              size-4 transition-all duration-150
              ${
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/40"
              }
              group-hover:text-amber-300
            `}
                        />
                      </button>
                    );
                  })}
                </div>

                <span className="text-sm font-medium">
                  {rating ? rating + "/5" : ""}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                Note personali (opzionale)
              </p>
              <Textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Aggiungi le tue impressioni..."
                className="min-h-28"
              />
            </div>

            {saveError && (
              <p className="text-destructive text-sm">{saveError}</p>
            )}
          </div>

          <DialogFooter>
            {/* <DialogClose asChild>
              <Button variant="ghost">Annulla</Button>
            </DialogClose> */}
            <Button
              onClick={handleAddBook}
              disabled={isSaving || !selectedBook}
            >
              {isSaving ? "Salvataggio..." : "Aggiungi alla libreria"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!isLoading &&
        debouncedQuery.length >= 2 &&
        results.length === 0 &&
        !searchError && (
          <Card>
            <CardContent className="text-muted-foreground py-8 text-center text-sm">
              Nessun risultato trovato.
            </CardContent>
          </Card>
        )}
    </div>
  );
}
