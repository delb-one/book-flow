import { BookCover } from "./book-cover";

interface BookSmallCardProps {
  book: {
    title: string;
    author: string;
    cover: string | null;
    coverTone: string;
  };
}

export function BookSmallCard({ book }: BookSmallCardProps) {
  return (
    <div className="flex shrink-0 flex-col gap-3 p-3">
      <BookCover
        cover={book.cover}
        title={book.title}
        tone={book.coverTone}
        className="h-70 w-50 shrink-0 border"
      />

      <div className="min-w-0 w-50">
        <p className="truncate text-sm font-medium">{book.title}</p>

        <p className="text-muted-foreground truncate text-xs">
          {book.author}
        </p>
      </div>
    </div>
  );
}
