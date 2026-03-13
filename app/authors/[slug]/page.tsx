import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Book,
  BookCheck,
  Bookmark,
  Check,
  Globe,
  MapPin,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookSmallCard } from "@/components/dashboard/book-small-card";
import { getLibraryBooks } from "@/lib/library-data";
import {
  getAuthorDetailsBySlug,
  getLibraryAuthorsFromOpenLibrary,
} from "@/lib/open-library-authors";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AuthorDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [books, authors, authorDetails] = await Promise.all([
    getLibraryBooks(),
    getLibraryAuthorsFromOpenLibrary(),
    getAuthorDetailsBySlug(slug),
  ]);
  const authorBooks = books.filter((book) => book.authorSlug === slug);
  const ownedBooks = authorBooks.filter((book) => book.status !== "wishlist");
  const wishlistBooks = authorBooks.filter(
    (book) => book.status === "wishlist",
  );

  if (authorBooks.length === 0) {
    notFound();
  }

  const authorName = authorBooks[0].author;
  const authorInfo = authors.find((author) => author.slug === slug) ?? null;
  const totalOwnedBooks = ownedBooks.length;
  const totalWishlistBooks = wishlistBooks.length;
  const primaryCount =
    totalOwnedBooks > 0 ? totalOwnedBooks : totalWishlistBooks;
  const primaryLabel =
    totalOwnedBooks > 0 ? "Libri posseduti" : "Libri da comprare";
  const PrimaryIcon = totalOwnedBooks > 0 ? Book : Bookmark;
  const booksRead = authorBooks.filter((book) => book.status === "read").length;
  const ratings = authorBooks
    .map((book) => book.rating)
    .filter((rating) => rating > 0);
  const averageRating = ratings.length
    ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
    : null;

  const needsWikipedia =
    !authorInfo?.bio || !authorInfo?.wikipediaUrl || !authorInfo?.photoUrl;
  const wikipediaData = needsWikipedia
    ? await getWikipediaSummary(authorName)
    : null;
  const wikipediaUrl = authorInfo?.wikipediaUrl ?? wikipediaData?.url ?? null;
  const bio = authorInfo?.bio ?? wikipediaData?.bio ?? null;
  const photoUrl = authorInfo?.photoUrl ?? wikipediaData?.photoUrl ?? null;

  const shouldPersist =
    Boolean((authorInfo?.id ?? authorDetails?.id) && wikipediaData) &&
    ((!authorInfo?.bio && wikipediaData?.bio) ||
      (!authorInfo?.wikipediaUrl && wikipediaData?.url) ||
      (!authorInfo?.photoUrl && wikipediaData?.photoUrl));

  if (shouldPersist) {
    await maybePersistAuthorMetadata({
      authorId: authorInfo?.id ?? authorDetails?.id ?? null,
      bio,
      wikipediaUrl,
      photoUrl,
    });
  }

  const formattedBirthDate = formatDate(authorDetails?.birth_date ?? null);
  const formattedDeathDate = formatDate(authorDetails?.death_date ?? null);
  const lifeSpan =
    formattedBirthDate || formattedDeathDate
      ? [formattedBirthDate ?? "?", formattedDeathDate ?? "—"].join(" – ")
      : null;
  const extraLinks = normalizeLinks(authorDetails?.links);

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

      <header className="flex flex-col gap-6 rounded-3xl bg-muted/30 p-6 lg:flex-row lg:items-start lg:gap-8">
        <div className="relative mx-auto size-28 shrink-0 overflow-hidden rounded-full border-4 border-white bg-muted shadow-[0_8px_24px_rgba(15,23,42,0.12)] md:mx-0">
          <Image
            src={photoUrl ?? "/images/author-placeholder.svg"}
            alt={`Ritratto di ${authorName}`}
            fill
            className="object-cover"
            sizes="112px"
          />
        </div>

        <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="space-y-2 ">
              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {authorName}
              </h1>
              <h5 className="text-lg font-medium text-muted-foreground">
                {authorDetails?.birth_date
                  ? formatDate(authorDetails.birth_date)
                  : "Data di nascita non disponibile"}
                {authorDetails?.death_date
                  ? ` - ${formatDate(authorDetails.death_date)}`
                  : ""}
              </h5>
              <p className="text-muted-foreground md:max-w-2xl lg:max-w-4xl text-sm leading-relaxed md:text-base">
                {bio ?? "Dati biografici non disponibili"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <MapPin className="size-4" />
                {authorDetails?.birth_place ??
                  "Luogo di nascita non disponibile"}
                {authorDetails?.nationality
                  ? ` (${authorDetails.nationality})`
                  : ""}
              </span>
              {wikipediaUrl && (
                <Link
                  href={wikipediaUrl}
                  className="inline-flex items-center gap-2 text-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Globe className="size-4" />
                  Wikipedia
                </Link>
              )}
              {authorDetails?.website && (
                <Link
                  href={authorDetails.website}
                  className="inline-flex items-center gap-2 text-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Globe className="size-4" />
                  Sito ufficiale
                </Link>
              )}
            </div>
            {extraLinks.length > 0 && (
              <section className="space-y-3">
                <div className="flex flex-wrap gap-3 text-sm">
                  {extraLinks.map((link) => (
                    <Link
                      key={link.url}
                      href={link.url}
                      className="inline-flex items-center gap-2 rounded-full border border-muted px-3 py-1 text-muted-foreground hover:text-foreground"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.title ?? link.url}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-2 lg:min-w-50">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardDescription className="text-sm">
                      {primaryLabel}
                    </CardDescription>
                    <CardTitle className="font-bold text-2xl">
                      {primaryCount}
                    </CardTitle>
                  </div>
                  <PrimaryIcon className="size-5 text-primary" aria-hidden />
                </div>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardDescription className="text-sm">
                      Libri letti
                    </CardDescription>
                    <CardTitle className="font-bold text-2xl">
                      {booksRead}
                    </CardTitle>
                  </div>
                  <BookCheck className="size-5 text-primary" aria-hidden />
                </div>
              </CardHeader>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardDescription className="text-sm">
                      Media Voti
                    </CardDescription>
                    <CardTitle className="font-bold text-2xl">
                      {averageRating ? averageRating.toFixed(1) : "n/a"}{" "}
                    </CardTitle>
                  </div>
                  <Star className="size-5 text-primary" aria-hidden />
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </header>

      {ownedBooks.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Libri posseduti</h2>
          </div>

          <div className="flex flex-wrap gap-4">
            {ownedBooks.map((book) => (
              <BookSmallCard
                key={book.id}
                book={{
                  title: book.title,
                  author: book.author,
                  cover: book.cover,
                  status: book.status,
                }}
              />
            ))}
          </div>
        </section>
      )}

      {wishlistBooks.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Da comprare</h2>
          </div>

          <div className="flex flex-wrap gap-4">
            {wishlistBooks.map((book) => (
              <BookSmallCard
                key={book.id}
                book={{
                  title: book.title,
                  author: book.author,
                  cover: book.cover,
                  status: book.status,
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

async function getWikipediaSummary(authorName: string) {
  const title = encodeURIComponent(authorName.trim().replace(/\s+/g, "_"));
  if (!title) return null;

  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`,
      { next: { revalidate: 60 * 60 * 24 } },
    );

    if (!response.ok) return null;

    const payload = (await response.json()) as {
      extract?: string;
      content_urls?: {
        desktop?: {
          page?: string;
        };
      };
      thumbnail?: {
        source?: string;
      };
      originalimage?: {
        source?: string;
      };
    };

    const bio = payload.extract?.trim();
    const url = payload.content_urls?.desktop?.page ?? null;
    const photoUrl =
      payload.originalimage?.source ?? payload.thumbnail?.source ?? null;

    if (!bio && !url && !photoUrl) return null;

    return {
      bio: bio ?? null,
      url,
      photoUrl,
    };
  } catch {
    return null;
  }
}

async function maybePersistAuthorMetadata({
  authorId,
  bio,
  wikipediaUrl,
  photoUrl,
}: {
  authorId: string | null;
  bio: string | null;
  wikipediaUrl: string | null;
  photoUrl: string | null;
}) {
  if (!authorId) return;

  const updates: {
    bio?: string;
    wikipedia_url?: string;
    photo_url?: string;
  } = {};

  if (bio) updates.bio = bio;
  if (wikipediaUrl) updates.wikipedia_url = wikipediaUrl;
  if (photoUrl) updates.photo_url = photoUrl;

  if (Object.keys(updates).length === 0) return;

  try {
    const supabase = createServerSupabaseClient();
    await supabase.from("authors").update(updates).eq("id", authorId);
  } catch {
    // Best-effort persistence; ignore failures
  }
}

function formatDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function normalizeLinks(value: unknown): { title?: string; url: string }[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const url =
        typeof (item as { url?: unknown }).url === "string"
          ? ((item as { url?: string }).url ?? "").trim()
          : "";
      if (!url) return null;
      const title =
        typeof (item as { title?: unknown }).title === "string"
          ? ((item as { title?: string }).title ?? "").trim()
          : undefined;
      return { url, title: title || undefined };
    })
    .filter((item): item is { title?: string; url: string } => Boolean(item));
}
