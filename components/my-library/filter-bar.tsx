"use client";

import { ArrowUpDown, Grid3X3, List, Search, SlidersHorizontal, Tag, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { ReadingStatus } from "@/lib/library-data";

type ViewMode = "grid" | "table";
type StatusFilter = "all" | ReadingStatus;
type SortBy = "recent" | "title" | "rating" | "year";

interface FilterBarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  query: string;
  onQueryChange: (query: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (status: StatusFilter) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  authorFilter: string;
  onAuthorFilterChange: (author: string) => void;
  sortBy: SortBy;
  onSortByChange: (sort: SortBy) => void;
  uniqueCategories: string[];
  uniqueAuthors: string[];
  filteredBooksCount: number;
  onReset: () => void;
}

export function FilterBar({
  viewMode,
  onViewModeChange,
  query,
  onQueryChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  authorFilter,
  onAuthorFilterChange,
  sortBy,
  onSortByChange,
  uniqueCategories,
  uniqueAuthors,
  filteredBooksCount,
  onReset,
}: FilterBarProps) {
  return (
    <>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="pl-9"
            placeholder="Cerca titolo, autore o categoria..."
          />
        </div>

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
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:flex-1 lg:flex-wrap lg:items-center">
          <Select
            value={statusFilter}
            onValueChange={(value) => onStatusFilterChange(value as StatusFilter)}
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
            onValueChange={(value) => onCategoryFilterChange(value)}
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
            onValueChange={(value) => onAuthorFilterChange(value)}
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
          <Select value={sortBy} onValueChange={(value) => onSortByChange(value as SortBy)}>
            <SelectTrigger className="lg:w-60">
              <ArrowUpDown className="size-4 text-muted-foreground" />
              <SelectValue placeholder="Ordina" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Ordina: aggiunti di recente</SelectItem>
              <SelectItem value="title">Ordina: titolo</SelectItem>
              <SelectItem value="rating">Ordina: valutazione</SelectItem>
              <SelectItem value="year">Ordina: anno pubblicazione</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-muted-foreground text-sm">{filteredBooksCount} libri trovati</p>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset filtri
        </Button>
      </div>
    </>
  );
}
