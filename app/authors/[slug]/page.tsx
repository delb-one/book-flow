import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLibraryBooks } from "@/lib/library-data";
import { cn, slugify } from "@/lib/utils";
import Image from "next/image";

const toneClass: Record<string, string> = {
  amber: "from-amber-200 to-amber-400",
  emerald: "from-emerald-200 to-emerald-500",
  rose: "from-rose-200 to-rose-500",
  indigo: "from-indigo-200 to-indigo-500",
  cyan: "from-cyan-200 to-cyan-500",
  slate: "from-slate-200 to-slate-500",
};

const statusLabel = {
  unread: "Non letto",
  reading: "In lettura",
  read: "Letto",
  wishlist: "Da comprare",
} as const;

const statusVariant = {
  unread: "muted",
  reading: "warning",
  read: "success",
  wishlist: "outline",
} as const;

export default async function AuthorDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const books = await getLibraryBooks();
  const authorBooks = books.filter((book) => book.authorSlug === slug);

  if (authorBooks.length === 0) {
    notFound();
  }

  const authorName = authorBooks[0].author;

  return (
    <div className="mx-auto w-full space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/authors">
            <ArrowLeft className="size-4" />
            Torna agli autori
          </Link>
        </Button>
      </div>

      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">{authorName}</h1>
        <p className="text-muted-foreground">
          {authorBooks.length} libri presenti nella tua libreria.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {authorBooks.map((book) => (
          <Link key={book.id} href={`/my-library/${slugify(book.title)}`}>
            <Card className="overflow-hidden">
              <div
                className={cn(
                  "relative h-40 w-full overflow-hidden bg-linear-to-br",
                  toneClass[book.coverTone],
                )}
              >
                {book.cover && (
                  <Image
                    src={book.cover}
                    alt={`Copertina di ${book.title}`}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-1 text-lg">
                  {book.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 pb-6">
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant[book.status]}>
                    {statusLabel[book.status]}
                  </Badge>
                  <Badge variant="outline">{book.year}</Badge>
                </div>

                <p className="text-muted-foreground line-clamp-3 text-sm">
                  {book.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {book.categories.map((category) => (
                    <Badge key={category} variant="outline">
                      {category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
