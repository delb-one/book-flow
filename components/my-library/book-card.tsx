"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { LibraryBook } from "@/lib/library-data";
import { slugify } from "@/lib/utils";
import { statusVariant } from "@/lib/library-status";
import { RatingStars } from "./rating-stars";
import { CoverWithSkeleton } from "./cover-with-skeleton";

interface BookCardProps {
  book: LibraryBook;
  onDeleteClick: (book: LibraryBook) => void;
}

export function BookCard({ book, onDeleteClick }: BookCardProps) {
  return (
    <article className="group bg-card relative rounded-lg border shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-sm">
      {book.status === "wishlist" && (
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="absolute right-3 top-3 z-1000 rounded-full  hover:bg-red-200 shadow-sm dark:bg-card dark:hover:bg-red-200
             opacity-0 scale-90 transition-all duration-150
             group-hover:opacity-100 group-hover:scale-100"
          onClick={() => onDeleteClick(book)}
          aria-label={`Rimuovi ${book.title} dalla wishlist`}
        >
          <Trash2 className="size-4 text-destructive" />
        </Button>
      )}
      <Link
        href={`/my-library/${slugify(book.title)}`}
        className="block w-full cursor-pointer text-left"
      >
        <div className="mb-3 h-44 w-full">
          <CoverWithSkeleton
            src={book.cover}
            alt={`Copertina di ${book.title}`}
            width={256}
            height={352}
          />
        </div>
        <div className="p-2">
          <p className="line-clamp-1 font-medium">{book.title}</p>
          <p className="text-muted-foreground mb-2 text-sm">{book.author}</p>
          <div className="mb-2 flex items-center justify-between">
            <Badge variant={statusVariant[book.status]}>
              {book.status === "unread" && "Non letto"}
              {book.status === "reading" && "In lettura"}
              {book.status === "read" && "Letto"}
              {book.status === "wishlist" && "Lista desideri"}
            </Badge>
            <RatingStars rating={book.rating} />
          </div>
          <div className="mb-2 flex flex-wrap gap-1">
            {book.categories.slice(0, 2).map((category) => (
              <Badge key={category} variant="outline">
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}
