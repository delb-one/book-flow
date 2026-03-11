"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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
  const [rating, setRating] = useState("0");
  const [notes, setNotes] = useState("");

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
          `/api/open-library/search?q=${encodeURIComponent(debouncedQuery)}`
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
            error instanceof Error ? error.message : "Errore durante la ricerca.";
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
    [results, selectedBookId]
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
          rating: Number(rating),
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
      setRating("0");
      setNotes("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Errore durante il salvataggio.";
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
          Cerca su Open Library e aggiungi nuovi libri alla tua libreria personale.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Ricerca</CardTitle>
          <CardDescription>Inserisci titolo o autore (minimo 2 caratteri)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pb-6">
          <div className="relative w-full max-w-xl">
            <Search className="text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-8"
              placeholder="Es. Dune, Calvino, Tolkien..."
            />
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
          const isSelected = selectedBookId === book.id;
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
                    <CardTitle className="line-clamp-2 text-lg">{book.title}</CardTitle>
                    <p className="text-muted-foreground line-clamp-1 text-sm">{book.author}</p>
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
                    setSaveError(null);
                    setSelectedBookId(isSelected ? null : book.id);
                  }}
                  variant={isSaved ? "secondary" : "default"}
                  className="w-full"
                >
                  {isSaved ? "Già aggiunto in questa sessione" : "Aggiungi alla libreria"}
                </Button>

                {isSelected && (
                  <div className="space-y-3 rounded-md border p-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value as AddStatus)}
                        className="border-input bg-background h-9 rounded-md border px-3 text-sm"
                      >
                        <option value="unread">Da leggere</option>
                        <option value="reading">In lettura</option>
                        <option value="read">Letto</option>
                        <option value="wishlist">Da comprare</option>
                      </select>
                      <select
                        value={rating}
                        onChange={(event) => setRating(event.target.value)}
                        className="border-input bg-background h-9 rounded-md border px-3 text-sm"
                      >
                        <option value="0">Valutazione: nessuna</option>
                        <option value="1">1 stella</option>
                        <option value="2">2 stelle</option>
                        <option value="3">3 stelle</option>
                        <option value="4">4 stelle</option>
                        <option value="5">5 stelle</option>
                      </select>
                    </div>
                    <textarea
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder="Note personali (opzionale)"
                      className="border-input bg-background min-h-20 w-full rounded-md border px-3 py-2 text-sm"
                    />
                    {saveError && <p className="text-destructive text-sm">{saveError}</p>}
                    <Button onClick={handleAddBook} disabled={isSaving} className="w-full">
                      {isSaving ? "Salvataggio..." : "Conferma aggiunta"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </section>

      {!isLoading && debouncedQuery.length >= 2 && results.length === 0 && !searchError && (
        <Card>
          <CardContent className="text-muted-foreground py-8 text-center text-sm">
            Nessun risultato trovato.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
