import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLibraryBooks } from "@/lib/library-data";

const toneClass: Record<string, string> = {
  amber: "from-amber-200 to-amber-400",
  emerald: "from-emerald-200 to-emerald-500",
  rose: "from-rose-200 to-rose-500",
  indigo: "from-indigo-200 to-indigo-500",
  cyan: "from-cyan-200 to-cyan-500",
  slate: "from-slate-200 to-slate-500",
};

export default async function AuthorsPage() {
  const books = await getLibraryBooks();
  const authors = Object.values(
    books.reduce<
      Record<string, { slug: string; name: string; books: typeof books }>
    >((acc, book) => {
      if (!acc[book.authorSlug]) {
        acc[book.authorSlug] = {
          slug: book.authorSlug,
          name: book.author,
          books: [],
        };
      }

      acc[book.authorSlug].books.push(book);
      return acc;
    }, {})
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Autori</h1>
        <p className="text-muted-foreground">
          Esplora gli autori presenti nella tua libreria personale.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {authors.map((author) => (
          <Card key={author.slug} className="transition-all hover:-translate-y-0.5 hover:shadow-sm">
            <CardHeader>
              <div className="mb-2 flex items-center justify-between gap-2">
                <CardTitle className="line-clamp-1 text-xl">{author.name}</CardTitle>
                <Badge variant="secondary">{author.books.length} libri</Badge>
              </div>
              <CardDescription className="flex items-center gap-1">
                <BookOpen className="size-4" />
                Anteprima dei libri in libreria
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pb-6">
              <div className="flex items-end gap-2">
                {author.books.slice(0, 4).map((book, index) => (
                  <div
                    key={book.id}
                    className={`rounded-md bg-linear-to-br ${toneClass[book.coverTone]} ${
                      index === 0 ? "h-24 w-16" : "h-20 w-14"
                    }`}
                  />
                ))}
              </div>

              <div className="space-y-1.5">
                {author.books.slice(0, 3).map((book) => (
                  <p key={book.id} className="text-muted-foreground line-clamp-1 text-sm">
                    {book.title}
                  </p>
                ))}
              </div>

              <Button asChild variant="outline" className="w-full justify-between">
                <Link href={`/authors/${author.slug}`}>
                  Vedi autore
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
