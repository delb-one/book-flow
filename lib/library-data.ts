import { createServerSupabaseClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";

export type ReadingStatus = "unread" | "reading" | "read" | "wishlist";

export type LibraryBook = {
  id: string;
  title: string;
  author: string;
  authorSlug: string;
  year: number;
  publisher: string;
  pages: number;
  description: string;
  cover: string | null;
  categories: string[];
  status: ReadingStatus;
  progress: number;
  rating: number;
  addedAt: string;
  notes: string;
  coverTone: "amber" | "emerald" | "rose" | "indigo" | "cyan" | "slate";
};

const tones = ["amber", "emerald", "rose", "indigo", "cyan", "slate"] as const;

function toneFromSeed(seed: string): LibraryBook["coverTone"] {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return tones[hash % tones.length];
}

type LibraryJoinedRow = {
  book_id: string | null;
  status: ReadingStatus | null;
  progress: number | null;
  rating: number | null;
  notes: string | null;
  added_at: string | null;
  books:
    | {
        id: string;
        title: string | null;
        year: number | null;
        publisher: string | null;
        pages: number | null;
        description: string | null;
        cover: string | null;
        categories: string[] | null;
        authors:
          | {
              name: string | null;
              slug: string | null;
            }
          | {
              name: string | null;
              slug: string | null;
            }[]
          | null;
      }
    | null;
};

async function fetchLibraryBooks(): Promise<LibraryBook[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("library_books")
    .select(
      `
      book_id,
      status,
      progress,
      rating,
      notes,
      added_at,
      books:books!library_books_book_id_fkey(
        id,
        title,
        year,
        publisher,
        pages,
        description,
        cover,
        categories,
        authors:authors!books_author_id_fkey(name,slug)
      )
    `
    )
    .order("added_at", { ascending: false });

  if (error) {
    throw new Error(`library_books joined query failed: ${error.message}`);
  }

  const rows = (data ?? []) as LibraryJoinedRow[];
  if (rows.length === 0) return [];

  return rows
    .map((row) => {
      const book = row.books;
      if (!book) return null;
      const author = Array.isArray(book.authors) ? book.authors[0] : book.authors;

      return {
        id: book.id,
        title: book.title ?? "Titolo sconosciuto",
        author: author?.name ?? "Autore sconosciuto",
        authorSlug: author?.slug ?? "autore-sconosciuto",
        year: book.year ?? 0,
        publisher: book.publisher ?? "",
        pages: book.pages ?? 0,
        description: book.description ?? "",
        cover: book.cover ?? null,
        categories: book.categories ?? [],
        status: row.status ?? "unread",
        progress: row.progress ?? 0,
        rating: row.rating ?? 0,
        addedAt: row.added_at ?? "",
        notes: row.notes ?? "",
        coverTone: toneFromSeed(book.id),
      } satisfies LibraryBook;
    })
    .filter((book): book is LibraryBook => Boolean(book));
}

const getLibraryBooksCached = unstable_cache(fetchLibraryBooks, ["library-books"], {
  tags: ["library-books"],
  revalidate: 60,
});

export async function getLibraryBooks(): Promise<LibraryBook[]> {
  return getLibraryBooksCached();
}
