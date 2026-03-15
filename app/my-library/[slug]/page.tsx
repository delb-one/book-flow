import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  BookOpen,
  BookText,
  PencilLine,
  TrendingUp,
} from "lucide-react";

import { getLibraryBooks } from "@/lib/library-data";
import { slugify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MyLibraryBookControls } from "@/components/my-library/book/my-library-book-controls";
import { MyLibraryNotesEditor } from "@/components/my-library/book/my-library-notes-editor";

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
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/my-library">
            <ArrowLeft className="size-4" />
            Torna alla libreria
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="relative aspect-3/4 w-full bg-muted">
              {book.cover ? (
                <Image
                  src={book.cover}
                  alt={`Copertina di ${book.title}`}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  Nessuna copertina
                </div>
              )}
            </div>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-4">
              <MyLibraryBookControls
                bookId={book.id}
                initialStatus={book.status}
                initialRating={book.rating}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <header className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              {book.title}
            </h1>

            <p className="text-muted-foreground text-sm">
              di
              <Button asChild variant="link" className="pl-1 h-auto">
                <Link href={`/authors/${book.authorSlug}`}>
                  <span className="font-semibold text-foreground">
                    {book.author}
                  </span>
                </Link>
              </Button>
            </p>
            <div className="flex flex-wrap gap-2">
              {book.categories.map((category) => (
                <Badge key={category} variant="outline">
                  {category}
                </Badge>
              ))}
            </div>
          </header>

            <Card>
            <CardContent className="grid gap-4 py-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-semibold uppercase">
                    Editore
                  </p>
                  <p className="text-sm font-medium">{book.publisher || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-semibold uppercase">
                    Anno
                  </p>
                  <p className="text-sm font-medium">{book.year || "-"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs font-semibold uppercase">
                    Pagine
                  </p>
                  <p className="text-sm font-medium">
                    {book.pages ? `${book.pages}` : "-"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <BookText className="size-5 text-primary" />
                <p className="text-base font-semibold">Trama</p>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm leading-relaxed p-4">
                {book.description || "Nessuna descrizione disponibile."}
              </CardContent>
            </Card>

          <Card className="bg-muted/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <PencilLine className="size-5 text-primary" />
                <p className="text-base font-semibold">Note personali</p>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <MyLibraryNotesEditor
                bookId={book.id}
                initialNotes={book.notes}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
