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
            {/* <CardHeader className="pb-3">
              <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">
                Preferenze lettura
              </p>
            </CardHeader> */}
            <CardContent className="space-y-4 p-4">
              <MyLibraryBookControls
                bookId={book.id}
                initialStatus={book.status}
                initialRating={book.rating}
              />

              {/* <div className="grid grid-cols-2 gap-4 border-t pt-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs font-semibold uppercase">
                    Inizio
                  </p>
                  <p className="font-medium">{book.addedAt || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-semibold uppercase">
                    Fine
                  </p>
                  <p className="font-medium">
                    {book.status === "read" ? "Completato" : "-"}
                  </p>
                </div>
              </div> */}

              {/* <div className="flex items-center gap-2 text-sm">
                <BookOpen className="size-4 text-muted-foreground" />
                <span>Scaffale: Main Bookshelf</span>
              </div> */}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <header className="space-y-2">
            <p className="text-muted-foreground text-sm">
              di <span className="font-semibold text-foreground">{book.author}</span>
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {book.title}
            </h1>
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
                  {book.pages ? `${book.pages} pagine` : "-"}
                </p>
              </div>
              
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <BookText className="size-5 text-primary" />
              <p className="text-base font-semibold">Sinossi</p>
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

          {/* <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="size-4 text-muted-foreground" />
                <p className="text-base font-semibold">Progresso lettura</p>
              </div>
              <Badge variant="secondary">{book.progress}%</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <Progress value={book.progress} />
              <div className="grid gap-3 text-xs text-muted-foreground sm:grid-cols-3">
                <div>
                  <p className="font-semibold text-foreground">Inizio</p>
                  <p>{book.addedAt || "-"}</p>
                </div>
                <div className="sm:text-center">
                  <p className="font-semibold text-foreground">
                    Pagina {Math.max(1, Math.round((book.progress / 100) * book.pages))}
                  </p>
                  <p>Ultimo aggiornamento</p>
                </div>
                <div className="sm:text-right">
                  <p className="font-semibold text-foreground">Obiettivo</p>
                  <p>-</p>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
}
