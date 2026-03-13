import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AuthorCard } from "@/types/authors";

type LibraryAuthorRow = {
  book_id: string | null;
  books:
    | {
        id: string;
        cover: string | null;
        authors:
          | {
              id: string | null;
              name: string | null;
              slug: string | null;
              photo_url: string | null;
              wikipedia_url: string | null;
              openlibrary_key: string | null;
            }
          | {
              id: string | null;
              name: string | null;
              slug: string | null;
              photo_url: string | null;
              wikipedia_url: string | null;
              openlibrary_key: string | null;
            }[]
          | null;
      }
    | null;
};

type AuthorAggregate = {
  id: string;
  slug: string;
  name: string;
  covers: string[];
  bookIds: Set<string>;
  photoUrl: string | null;
  wikipediaUrl: string | null;
  openLibraryKey: string | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getAuthorPhotoUrl(openLibraryKey: string | null) {
  if (!openLibraryKey) return null;
  return `https://covers.openlibrary.org/a/olid/${openLibraryKey}-M.jpg`;
}

export async function getLibraryAuthorsFromOpenLibrary(): Promise<AuthorCard[]> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase.from("library_books").select(
    `
      book_id,
      books:books!library_books_book_id_fkey(
        id,
        cover,
        authors:authors!books_author_id_fkey(
          id,
          name,
          slug,
          photo_url,
          wikipedia_url,
          openlibrary_key
        )
      )
    `,
  );

  if (error) {
    throw new Error(`library_books authors query failed: ${error.message}`);
  }

  const rows = (data ?? []) as LibraryAuthorRow[];
  if (rows.length === 0) return [];

  const map = new Map<string, AuthorAggregate>();

  for (const row of rows) {
    const book = row.books;
    if (!book) continue;

    const author = Array.isArray(book.authors)
      ? book.authors[0]
      : book.authors;
    if (!author) continue;

    const name = author.name ?? "Autore sconosciuto";
    const slug = author.slug ?? slugify(name);
    const id = author.id ?? slug ?? name;
    const openLibraryKey = author.openlibrary_key?.trim() || null;

    if (!map.has(id)) {
      map.set(id, {
        id,
        slug,
        name,
        covers: [],
        bookIds: new Set(),
        photoUrl: author.photo_url ?? null,
        wikipediaUrl: author.wikipedia_url ?? null,
        openLibraryKey,
      });
    }

    const entry = map.get(id);
    if (!entry) continue;

    entry.bookIds.add(book.id);

    if (book.cover && !entry.covers.includes(book.cover)) {
      entry.covers.push(book.cover);
    }
  }

  return Array.from(map.values())
    .map((author) => {
      const photoUrl = author.photoUrl ?? getAuthorPhotoUrl(author.openLibraryKey);

      return {
        id: author.id,
        slug: author.slug,
        name: author.name,
        bookCount: author.bookIds.size,
        covers: author.covers.slice(0, 3),
        photoUrl,
        wikipediaUrl: author.wikipediaUrl,
        openLibraryKey: author.openLibraryKey,
      } satisfies AuthorCard;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}
