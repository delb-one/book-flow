"use client";

import { Loader2, RotateCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipTrigger } from "@radix-ui/react-tooltip";
import { TooltipContent } from "../ui/tooltip";

interface SearchCardProps {
  query: string;
  onQueryChange: (value: string) => void;
  isLoading: boolean;
  searchError: string | null;
  resultsCount: number;
  handleRecommend: () => void;
}

export function SearchCard({
  query,
  onQueryChange,
  handleRecommend,
  isLoading,
  searchError,
  resultsCount,
}: SearchCardProps) {
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div>
          <CardTitle>Ricerca</CardTitle>
          <CardDescription>
            Inserisci titolo o autore (minimo 2 caratteri)
          </CardDescription>
        </div>
        <Tooltip>
          <TooltipTrigger>
            <Button
              size="icon"
              variant="outline"
              onClick={handleRecommend}
              className="self-end text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
            >
              <RotateCcw />
            </Button>{" "}
          </TooltipTrigger>
          <TooltipContent>
            <p>Consigliami un altro libro</p>
          </TooltipContent>
        </Tooltip>
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

        <div className="flex flex-col justify-between gap-3 pt-2">
          <p className="text-muted-foreground text-sm">
            {resultsCount === 0 && ""}
            {resultsCount > 0 && `${resultsCount} risultati trovati`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
