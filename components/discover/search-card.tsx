"use client";

import { Loader2, Search, X } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface SearchCardProps {
  query: string;
  onQueryChange: (value: string) => void;
  isLoading: boolean;
  searchError: string | null;
  resultsCount: number;
}

export function SearchCard({
  query,
  onQueryChange,
  isLoading,
  searchError,
}: SearchCardProps) {
  return (
    <Card className="bg-transparent border-0 shadow-none">
      <CardHeader className="flex justify-between items-center">
        <div className="space-y-2">
          <CardTitle>Ricerca</CardTitle>
          <CardDescription>
            Inserisci titolo o autore (minimo 2 caratteri)
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pb-6">
        <div className="relative w-full max-w-xl flex items-center gap-2">
          <div className="relative w-full">
            <Search className="text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              className="pl-8 pr-8"
              placeholder="Es. Dune, Calvino, Tolkien..."
            />
            {query && (
              <button
                onClick={() => onQueryChange("")}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 transition-colors"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
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
  );
}
