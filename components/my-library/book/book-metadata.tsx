import { Calendar, BookOpen, Building } from "lucide-react";

type Props = {
  publisher?: string;
  year?: number;
  pages?: number;
};

export function BookMetadata({ publisher, year, pages }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
      {publisher && (
        <span className="flex items-center gap-1">
          <Building className="size-4" />
          {publisher}
        </span>
      )}

      {year && (
        <span className="flex items-center gap-1">
          <Calendar className="size-4" />
          {year}
        </span>
      )}

      {pages && (
        <span className="flex items-center gap-1">
          <BookOpen className="size-4" />
          {pages} pages
        </span>
      )}
    </div>
  );
}