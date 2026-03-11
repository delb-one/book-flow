import { statusLabel, statusVariant } from "@/app/page";
import { Badge } from "../ui/badge";
import { BookCover } from "./book-cover";
import Link from "next/link";
import { slugify } from "@/lib/utils";

interface BookSmallCardProps {
  book: {
    title: string;
    author: string;
    cover: string | null;
    coverTone: string;
    status: "unread" | "reading" | "read" | "wishlist";
  };
}

export function BookSmallCard({ book }: BookSmallCardProps) {
  return (
    <div className="flex shrink-0 flex-col gap-3 p-3">
      <Link href={`/my-library/${slugify(book.title)}`}>
        <BookCover
          cover={book.cover}
          title={book.title}
          tone={book.coverTone}
          className="h-70 w-50 shrink-0 border"
        />
      </Link>

      <div className="min-w-0 w-50">
        <p className="truncate text-sm font-medium">{book.title}</p>
        <p className="text-muted-foreground truncate text-xs">{book.author}</p>
        <Badge className="mt-2" variant={statusVariant[book.status]}>
          {statusLabel[book.status]}
        </Badge>
      </div>
    </div>
  );
}
