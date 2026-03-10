import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookCover } from "./book-cover";
import { statusLabel, statusVariant } from "@/app/page";

interface BookReadingCardProps {
  book: {
    title: string;
    author: string;
    cover: string | null;
    coverTone: string;
    status: "unread" | "reading" | "read";
    progress: number;
  };
}

export function BookReadingCard({ book }: BookReadingCardProps) {
  return (
    <div className="flex items-center gap-4 p-3 border rounded-lg min-w-0">
      <BookCover
        cover={book.cover}
        title={book.title}
        tone={book.coverTone}
        className="h-30 w-20"
      />

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <p className="truncate font-medium">{book.title}</p>

          <Badge variant={statusVariant[book.status]}>
            {statusLabel[book.status]}
          </Badge>
        </div>

        <p className="text-muted-foreground mb-2 text-sm">{book.author}</p>

        <Progress value={book.progress} />
      </div>

      <span className="text-muted-foreground text-sm">{book.progress}%</span>
    </div>
  );
}