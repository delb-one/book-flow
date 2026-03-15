import { notFound } from "next/navigation";

import { getLibraryBooks } from "@/lib/library-data";
import {
  getAuthorDetailsBySlug,
  getLibraryAuthorsFromOpenLibrary,
} from "@/lib/open-library-authors";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { BackButton } from "@/components/authors/author/back-button";
import { Info } from "@/components/authors/author/info";
import { BooksSection } from "@/components/authors/author/books-section";

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
  const extraLinks = normalizeLinks(authorDetails?.links);

  return (
    <div className="mx-auto w-full space-y-8">
      <BackButton />
      <div className="flex flex-col lg:flex-row gap-4">
        <Info
          authorName={authorName}
          photoUrl={photoUrl}
          birthDate={formattedBirthDate}
          deathDate={formattedDeathDate}
          birthPlace={authorDetails?.birth_place ?? null}
          nationality={authorDetails?.nationality ?? null}
          bio={bio}
          wikipediaUrl={wikipediaUrl}
          website={authorDetails?.website ?? null}
          extraLinks={extraLinks}
          totalOwnedBooks={totalOwnedBooks}
          totalWishlistBooks={totalWishlistBooks}
          booksRead={booksRead}
          averageRating={averageRating}
        />
        <div className="w-full lg:w-2/5 flex lg:flex-row min-w-0 gap-4 ">
          {ownedBooks.length > 0 && (
            <BooksSection
              title="Libri posseduti"
              books={ownedBooks}
              badge={totalOwnedBooks}
              variant="owned"
            />
          )}
          {wishlistBooks.length > 0 && (
            <BooksSection
              title="Da comprare"
              books={wishlistBooks}
              badge={totalWishlistBooks}
              variant="wishlist"
            />
          )}
        </div>
      </div>
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
  const result: { title?: string; url: string }[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const url =
      typeof (item as { url?: unknown }).url === "string"
        ? ((item as { url?: string }).url ?? "").trim()
        : "";
    if (!url) continue;
    const title =
      typeof (item as { title?: unknown }).title === "string"
        ? ((item as { title?: string }).title ?? "").trim()
        : undefined;
    result.push({ url, title: title || undefined });
  }
  return result;
}
