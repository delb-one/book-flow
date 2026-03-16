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
      <DialogContent className="max-w-2xl max-h-[70vh] flex flex-col">
        <DialogHeader>
          <div className="flex gap-6">
            <div className="bg-muted relative h-48 w-32 shrink-0 overflow-hidden rounded-md">
              {book.cover ? (
                <Image
                  src={book.cover}
                  alt={`Copertina di ${book.title}`}
                  className="h-full w-full object-cover"
                  width={128}
                  height={192}
                  unoptimized
                />
              ) : (
                <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
                  No cover
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <DialogTitle className="line-clamp-2 text-xl">
                {book.title}
              </DialogTitle>
              <p className="text-muted-foreground text-base">{book.author}</p>
              <div className="flex flex-wrap gap-4 text-sm">
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
          </div>
        </DialogHeader>
        {book.description && (
          <div className="prose prose-sm max-w-none overflow-y-auto no-scrollbar dark:prose-invert min-h-0 flex-1">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {book.description}
            </ReactMarkdown>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
