import { createServerSupabaseClient } from "@/lib/supabase/server";

export type ReadingStatus = "unread" | "reading" | "read";

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

type LibraryRow = {
  book_id: string;
  status: ReadingStatus | null;
  progress: number | null;
  rating: number | null;
  notes: string | null;
  added_at: string | null;
};

type BookRow = {
  id: string;
  title: string | null;
  author_id: string | null;
  year: number | null;
  publisher: string | null;
  pages: number | null;
  description: string | null;
  cover: string | null;
  categories: string[] | null;
};

type AuthorRow = {
  id: string;
  name: string | null;
  slug: string | null;
};

export async function getLibraryBooks(): Promise<LibraryBook[]> {
  const supabase = createServerSupabaseClient();

  const { data: libraryRows, error: libraryError } = await supabase
    .from("library_books")
    .select("book_id,status,progress,rating,notes,added_at")
    .order("added_at", { ascending: false });

  if (libraryError) {
    throw new Error(`library_books query failed: ${libraryError.message}`);
  }

  const rows = (libraryRows ?? []) as LibraryRow[];
  if (rows.length === 0) return [];

  const bookIds = [...new Set(rows.map((row) => row.book_id))];
  const { data: booksRows, error: booksError } = await supabase
    .from("books")
    .select("id,title,author_id,year,publisher,pages,description,cover,categories")
    .in("id", bookIds);

  if (booksError) {
    throw new Error(`books query failed: ${booksError.message}`);
  }

  const books = (booksRows ?? []) as BookRow[];
  const bookById = new Map(books.map((book) => [book.id, book]));

  const authorIds = [
    ...new Set(
      books
        .map((book) => book.author_id)
        .filter((authorId): authorId is string => Boolean(authorId))
    ),
  ];

  const authorById = new Map<string, AuthorRow>();

  if (authorIds.length > 0) {
    const { data: authorsRows, error: authorsError } = await supabase
      .from("authors")
      .select("id,name,slug")
      .in("id", authorIds);

    if (authorsError) {
      throw new Error(`authors query failed: ${authorsError.message}`);
    }

    for (const author of (authorsRows ?? []) as AuthorRow[]) {
      authorById.set(author.id, author);
    }
  }

  return rows
    .map((row) => {
      const book = bookById.get(row.book_id);
      if (!book) return null;

      const author = book.author_id ? authorById.get(book.author_id) : null;

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

