import { notFound } from "next/navigation";

import { getLibraryBooks } from "@/lib/library-data";
import { slugify } from "@/lib/utils";

import { BackButton } from "@/components/my-library/book/back-button";
import { BookCover } from "@/components/my-library/book/book-cover";
import { BookHeader } from "@/components/my-library/book/book-header";
import { BookMetadata } from "@/components/my-library/book/book-metadata";
import { BookDescription } from "@/components/my-library/book/book-description";
import { BookNotes } from "@/components/my-library/book/book-notes";
import { BookControls } from "@/components/my-library/book/book-controls";
import { Card, CardContent } from "@/components/ui/card";

export default async function MyLibraryBookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const books = await getLibraryBooks();
  const book = books.find((item) => slugify(item.title) === slug);

  if (!book) {
    notFound();
  }

  return (
    <div className="mx-auto w-full space-y-8">
      <BackButton />

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <div className="space-y-6">
          <BookCover cover={book.cover} title={book.title} />

          <Card>
            <CardContent className="space-y-4 p-4">
              <BookControls
                bookId={book.id}
                initialStatus={book.status}
                initialRating={book.rating}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <BookHeader
            title={book.title}
            author={book.author}
            authorSlug={book.authorSlug}
            categories={book.categories}
          />

          <BookMetadata
            publisher={book.publisher}
            year={book.year}
            pages={book.pages}
          />

          <BookDescription description={book.description} />

          <BookNotes bookId={book.id} initialNotes={book.notes} />
        </div>
      </div>
    </div>
  );
}
