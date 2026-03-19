import { notFound } from "next/navigation";

import { getLibraryBooks } from "@/lib/library-data";
import { slugify } from "@/lib/utils";

import { BackButton } from "@/components/back-button";
import { CoverCarousel } from "@/components/my-library/book/cover-carousel";
import { CustomCoverUploader } from "@/components/my-library/book/custom-cover-uploader";
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
    <div className="mx-auto w-full space-y-6">
      <BackButton title="Torna alla libreria" url="/my-library" />

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="space-y-4">
          <CoverCarousel
            covers={book.covers}
            fallbackCover={book.cover}
            title={book.title}
          />
          <CustomCoverUploader bookId={book.id} />

          <Card>
            <CardContent className="p-4">
              <BookControls
                bookId={book.id}
                initialStatus={book.status}
                initialRating={book.rating}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
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

          <div className="grid gap-6 lg:grid-cols-[3fr_1fr]">
            <BookDescription description={book.description} />

            <div className="max-h-125 overflow-y-auto">
              <BookNotes bookId={book.id} initialNotes={book.notes} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
