"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { SearchResult } from "./types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BookDetailsModalProps {
  book: SearchResult | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookDetailsModal({
  book,
  open,
  onOpenChange,
}: BookDetailsModalProps) {
  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[90vw] md:max-w-5xl max-h-[80vh] flex flex-col"
        aria-describedby=""
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">{book.title}</DialogTitle>
        </DialogHeader>

        {/* Container principale: cover a sinistra, resto a destra */}
        <div className="mt-4 flex flex-col md:flex-row flex-1 gap-6 overflow-y-auto no-scrollbar">
          {/* Colonna sinistra: solo cover */}
          <div className="shrink-0 w-full md:w-48">
            <div className="bg-muted relative h-64 w-full overflow-hidden rounded-md">
              {book.cover ? (
                <Image
                  src={book.cover}
                  alt={`Copertina di ${book.title}`}
                  className="h-full w-full object-cover"
                  width={192}
                  height={256}
                  unoptimized
                />
              ) : (
                <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
                  No cover
                </div>
              )}
            </div>
          </div>

          {/* Colonna destra: titolo, autore, info, categorie e descrizione */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="space-y-2">
              <p className="text-muted-foreground text-base">{book.author}</p>

              <div className="flex flex-wrap gap-2 text-sm">
                {book.year && (
                  <div>
                    <span className="text-muted-foreground">Anno: </span>
                    <span>{book.year}</span>
                  </div>
                )}
                {book.publisher && (
                  <div>
                    <span className="text-muted-foreground">Editore: </span>
                    <span>{book.publisher}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {(book.categories.length
                  ? book.categories
                  : ["Senza categoria"]
                ).map((category) => (
                  <Badge key={category} variant="outline">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {book.description && (
              <div className="prose prose-sm max-w-none flex-1 overflow-y-auto no-scrollbar dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {book.description}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
