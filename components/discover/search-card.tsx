"use client";

import { Grid3X3, List, Loader2, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import type { ViewMode } from "./types";

interface SearchCardProps {
  query: string;
  onQueryChange: (value: string) => void;
  onRecommend: () => void;
  isLoading: boolean;
  isRecommending: boolean;
  searchError: string | null;
  recommendationError: string | null;
  recommendationReason: string | null;
  resultsCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function SearchCard({
  query,
  onQueryChange,
  onRecommend,
  isLoading,
  isRecommending,
  searchError,
  recommendationError,
  recommendationReason,
  resultsCount,
  viewMode,
  onViewModeChange,
}: SearchCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ricerca</CardTitle>
        <CardDescription>Inserisci titolo o autore (minimo 2 caratteri)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 pb-6">
        <div className="relative w-full max-w-xl flex items-center gap-2">
          <div>
            <Search className="text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              className="pl-8"
              placeholder="Es. Dune, Calvino, Tolkien..."
            />
          </div>
          <Button
            variant="default"
            onClick={onRecommend}
            disabled={isLoading || isRecommending}
          >
            {isRecommending ? "Consiglio in corso..." : "Consigliami un libro"}
          </Button>
        </div>

        {isLoading && (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Loader2 className="size-4 animate-spin" />
            Ricerca in corso...
          </div>
        )}

        {searchError && <p className="text-destructive text-sm">{searchError}</p>}

        {recommendationError && (
          <p className="text-destructive text-sm">{recommendationError}</p>
        )}

        {recommendationReason && (
          <p className="text-muted-foreground text-xs">{recommendationReason}</p>
        )}

        <div className="flex items-center justify-between gap-3 pt-2">
          <p className="text-muted-foreground text-sm">{resultsCount} risultati trovati</p>
          <div className="inline-flex rounded-md border p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
            >
              <Grid3X3 className="size-4" />
              Griglia
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("table")}
            >
              <List className="size-4" />
              Tabella
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
