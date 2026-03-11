import { NextResponse } from "next/server";

import { getLibraryBooks } from "@/lib/library-data";

type OpenLibraryDoc = {
  key?: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  publisher?: string[];
  cover_i?: number;
  subject?: string[];
  number_of_pages_median?: number;
};

type SearchResult = {
  id: string;
  title: string;
  author: string;
  year: number | null;
  publisher: string | null;
  pages: number | null;
  cover: string | null;
  categories: string[];
  description: string;
  source: "openlibrary";
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function mapDoc(doc: OpenLibraryDoc): SearchResult | null {
  const key = doc.key?.replace("/works/", "").trim();
  const title = doc.title?.trim();

  if (!key || !title) return null;

  const cover = doc.cover_i
    ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
    : null;

  return {
    id: key,
    title,
    author: doc.author_name?.[0] ?? "Autore sconosciuto",
    year: doc.first_publish_year ?? null,
    publisher: doc.publisher?.[0] ?? null,
    pages: doc.number_of_pages_median ?? null,
    cover,
    categories: (doc.subject ?? []).slice(0, 5),
    description: "",
    source: "openlibrary",
  };
}

async function enrichWork(result: SearchResult) {
  try {
    const workUrl = `https://openlibrary.org/works/${result.id}.json`;
    const editionsUrl = `https://openlibrary.org/works/${result.id}/editions.json?limit=1`;

    const [workRes, editionsRes] = await Promise.all([
      fetch(workUrl),
      fetch(editionsUrl),
    ]);

    if (workRes.ok) {
      const work = await workRes.json();

      if (typeof work.description === "string") {
        result.description = work.description;
      }

      if (typeof work.description?.value === "string") {
        result.description = work.description.value;
      }

      if (!result.categories?.length && work.subjects) {
        result.categories = work.subjects.slice(0, 5);
      }
    }

    if (editionsRes.ok) {
      const editions = await editionsRes.json();
      const edition = editions.entries?.[0];

      if (edition) {
        if (!result.publisher) {
          result.publisher = edition.publisher?.[0] ?? null;
        }

        if (!result.pages) {
          result.pages = edition.number_of_pages ?? null;
        }
      }
    }

    return result;
  } catch {
    return result;
  }
}

function pickWeighted(items: [string, number][]) {
  const total = items.reduce((sum, [, weight]) => sum + weight, 0);
  if (total <= 0) return items[0]?.[0] ?? null;

  let threshold = Math.random() * total;
  for (const [value, weight] of items) {
    threshold -= weight;
    if (threshold <= 0) return value;
  }
  return items[items.length - 1]?.[0] ?? null;
}

function scoreResult(result: SearchResult) {
  let score = 0;
  if (result.cover) score += 2;
  if (result.description) score += 2;
  if (result.year) score += 1;
  if (result.pages) score += 1;
  score += Math.random() * 0.25;
  return score;
}

export async function GET() {
  try {
    const books = await getLibraryBooks();
    const categoryCounts = new Map<string, number>();

    for (const book of books) {
      for (const category of book.categories) {
        const trimmed = category?.trim();
        if (!trimmed) continue;
        categoryCounts.set(trimmed, (categoryCounts.get(trimmed) ?? 0) + 1);
      }
    }

    if (categoryCounts.size === 0) {
      return NextResponse.json(
        { error: "Nessuna categoria trovata nella libreria." },
        { status: 400 },
      );
    }

    const category = pickWeighted(Array.from(categoryCounts.entries()));
    if (!category) {
      return NextResponse.json(
        { error: "Impossibile selezionare una categoria." },
        { status: 500 },
      );
    }

    const url = new URL("https://openlibrary.org/search.json");
    url.searchParams.set("q", `subject:"${category}"`);
    url.searchParams.set("limit", "12");
    url.searchParams.set(
      "fields",
      "key,title,author_name,first_publish_year,publisher,subject,cover_i,number_of_pages_median",
    );

    const response = await fetch(url.toString(), {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Open Library non disponibile." },
        { status: 502 },
      );
    }

    const payload = (await response.json()) as { docs?: OpenLibraryDoc[] };
    const mapped = (payload.docs ?? [])
      .map(mapDoc)
      .filter((result): result is SearchResult => Boolean(result));

    if (mapped.length === 0) {
      return NextResponse.json(
        { error: "Nessun risultato per la categoria selezionata." },
        { status: 404 },
      );
    }

    const enriched = await Promise.all(mapped.slice(0, 6).map(enrichWork));
    const libraryIds = new Set(books.map((book) => book.id));
    const libraryKeySet = new Set(
      books.map((book) => `${normalize(book.title)}-${normalize(book.author)}`),
    );

    const filtered = enriched.filter((result) => {
      if (libraryIds.has(result.id)) return false;
      const key = `${normalize(result.title)}-${normalize(result.author)}`;
      return !libraryKeySet.has(key);
    });

    if (filtered.length === 0) {
      return NextResponse.json(
        {
          error:
            "I risultati trovati sono già presenti nella tua libreria.",
        },
        { status: 404 },
      );
    }

    const sorted = [...filtered].sort(
      (a, b) => scoreResult(b) - scoreResult(a),
    );
    const result = sorted[0];

    return NextResponse.json({
      result,
      reason: {
        category,
        message: `Consiglio basato su: ${category}`,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Errore durante la raccomandazione." },
      { status: 500 },
    );
  }
}
