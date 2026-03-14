"use client";

import Image from "next/image";
import { Bookmark, BookOpen, CheckCircle2, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import type { AddStatus, SearchResult } from "./types";

interface AddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBook: SearchResult | null;
  status: AddStatus;
  onStatusChange: (status: AddStatus) => void;
  rating: number;
  onRatingChange: (rating: number) => void;
  notes: string;
  onNotesChange: (value: string) => void;
  onConfirm: () => void;
  isSaving: boolean;
  saveError: string | null;
}

export function AddDialog({
  open,
  onOpenChange,
  selectedBook,
  status,
  onStatusChange,
  rating,
  onRatingChange,
  notes,
  onNotesChange,
  onConfirm,
  isSaving,
  saveError,
}: AddDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                <p className="text-base font-semibold">{selectedBook.title}</p>
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
                    onClick={() => onStatusChange(value as AddStatus)}
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
                      onClick={() => onRatingChange(value)}
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
              onChange={(event) => onNotesChange(event.target.value)}
              placeholder="Aggiungi le tue impressioni..."
              className="min-h-28"
            />
          </div>

          {saveError && <p className="text-destructive text-sm">{saveError}</p>}
        </div>

        <DialogFooter>
          <Button onClick={onConfirm} disabled={isSaving || !selectedBook}>
            {isSaving ? "Salvataggio..." : "Aggiungi alla libreria"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
