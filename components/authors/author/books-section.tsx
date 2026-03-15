import type { LibraryBook } from "@/lib/library-data";
import { BookSmallCard } from "@/components/dashboard/book-small-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { Badge } from "@/components/ui/badge";

type BooksSectionProps = {
  title: string;
  books: LibraryBook[];
  badge?: number;
  variant?: "owned" | "wishlist";
};

export function BooksSection({
  title,
  books,
  badge,
  variant = "owned",
}: BooksSectionProps) {
  if (books.length === 0) return null;

  return (
    <section className="space-y-4 flex-1">
      {variant === "owned" ? (
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="leading-none font-bold">{title}</h1>
              {badge !== undefined && <Badge variant="default">{badge}</Badge>}
            </div>
          </div>
        </div>
      ) : (
        <SectionHeader title={title} badge={badge} book={{ status: "wishlist" }} />
      )}

      <div className="flex gap-4 overflow-x-auto pb-2">
        {books.map((book) => (
          <div key={book.id} className="shrink-0">
            <BookSmallCard
              key={book.id}
              book={{
                title: book.title,
                author: book.author,
                cover: book.cover,
                status: book.status,
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
