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

interface BookTableRowProps {
  book: LibraryBook;
  onDeleteClick: (book: LibraryBook) => void;
}

export function BookTableRow({ book, onDeleteClick }: BookTableRowProps) {
  return (
    <tr key={book.id} className="border-t">
      <td className="px-3 py-2">
        <div className="h-14 w-10">
          <CoverWithSkeleton
            src={book.cover}
            alt={`Copertina di ${book.title}`}
            width={40}
            height={56}
          />
        </div>
      </td>
      <td className="px-3 py-2">
        <p className="font-medium">{book.title}</p>
        <p className="text-muted-foreground text-xs">{book.year || "-"}</p>
      </td>
      <td className="px-3 py-2">{book.author}</td>
      <td className="px-3 py-2">
        <div className="flex flex-wrap gap-1">
          {book.categories.map((category) => (
            <Badge key={category} variant="outline">
              {category}
            </Badge>
          ))}
        </div>
      </td>
      <td className="px-3 py-2">
        <RatingStars rating={book.rating} />
      </td>
      <td className="px-3 py-2">
        <Badge variant={statusVariant[book.status]}>
          {book.status === "unread" && "Non letto"}
          {book.status === "reading" && "In lettura"}
          {book.status === "read" && "Letto"}
          {book.status === "wishlist" && "Lista desideri"}
        </Badge>
      </td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/my-library/${slugify(book.title)}`}>
              Dettagli
            </Link>
          </Button>
          {book.status === "wishlist" && (
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="hover:bg-red-200"
              onClick={() => onDeleteClick(book)}
              aria-label={`Rimuovi ${book.title} dalla wishlist`}
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}
