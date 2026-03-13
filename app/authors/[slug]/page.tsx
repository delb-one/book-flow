import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Globe,
  MapPin,
  Star,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLibraryBooks } from "@/lib/library-data";
import { getLibraryAuthorsFromOpenLibrary } from "@/lib/open-library-authors";
import { cn, slugify } from "@/lib/utils";

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
  const authors = await getLibraryAuthorsFromOpenLibrary();
  const authorInfo = authors.find((author) => author.slug === slug) ?? null;
  const totalBooks = authorBooks.length;
  const booksRead = authorBooks.filter((book) => book.status === "read").length;
  const ratings = authorBooks
    .map((book) => book.rating)
    .filter((rating) => rating > 0);
  const averageRating = ratings.length
    ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
    : null;

  return (
    <div className="mx-auto w-full space-y-8">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/authors">
            <ArrowLeft className="size-4" />
            Torna agli autori
          </Link>
        </Button>
      </div>

      <header className="flex flex-col gap-6 rounded-3xl bg-muted/30 p-6 md:flex-row md:items-center md:gap-8">
        <div className="relative mx-auto size-28 shrink-0 overflow-hidden rounded-full border-4 border-white bg-muted shadow-[0_8px_24px_rgba(15,23,42,0.12)] md:mx-0">
          <Image
            src={authorInfo?.photoUrl ?? "/images/author-placeholder.svg"}
            alt={`Ritratto di ${authorName}`}
            fill
            className="object-cover"
            sizes="112px"
          />
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {authorName}
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed md:text-base">
              Autore presente nella tua libreria. Qui trovi i libri salvati e
              le statistiche di lettura.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4" />
              Dati biografici non disponibili
            </span>
            {authorInfo?.wikipediaUrl && (
              <Link
                href={authorInfo.wikipediaUrl}
                className="inline-flex items-center gap-2 text-primary"
                target="_blank"
                rel="noreferrer"
              >
                <Globe className="size-4" />
                Wikipedia
              </Link>
            )}
            <span className="inline-flex items-center gap-2 text-primary">
              <BadgeCheck className="size-4" />
              Autore verificato
            </span>
          </div>
        </div>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Reading Stats</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Total Books
              </p>
            </CardHeader>
            <CardContent className="flex items-center gap-3 pb-6">
              <span className="text-3xl font-semibold">{totalBooks}</span>
              <span className="text-primary text-sm">📘</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Books Read
              </p>
            </CardHeader>
            <CardContent className="flex items-center gap-3 pb-6">
              <span className="text-3xl font-semibold">{booksRead}</span>
              <span className="text-emerald-600 text-sm">✓</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Average Rating
              </p>
            </CardHeader>
            <CardContent className="flex items-center gap-3 pb-6">
              <span className="text-3xl font-semibold">
                {averageRating ? averageRating.toFixed(1) : "—"}
              </span>
              <Star className="size-5 text-amber-400" />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Books in Library</h2>
          <Link href="/my-library" className="text-sm text-primary">
            View All
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {authorBooks.map((book) => (
          <Link key={book.id} href={`/my-library/${slugify(book.title)}`}>
            <Card className="group overflow-hidden">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                {book.cover ? (
                  <Image
                    src={book.cover}
                    alt={`Copertina di ${book.title}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                    No cover
                  </div>
                )}
                <Badge
                  variant={statusVariant[book.status]}
                  className="absolute right-2 top-2"
                >
                  {statusLabel[book.status]}
                </Badge>
              </div>

              <CardContent className="space-y-2 pb-5 pt-4">
                <CardTitle className="line-clamp-1 text-base">
                  {book.title}
                </CardTitle>
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      className={cn(
                        "size-3",
                        book.rating >= index + 1
                          ? "fill-amber-400"
                          : "fill-transparent text-muted-foreground/40",
                      )}
                    />
                  ))}
                  <span className="text-muted-foreground text-xs">
                    {book.rating ? book.rating.toFixed(1) : "—"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        </div>
      </section>
    </div>
  );
}
