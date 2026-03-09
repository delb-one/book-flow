import { NextRequest, NextResponse } from "next/server";

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

function mapDocToResult(doc: OpenLibraryDoc): SearchResult | null {
  const key = doc.key?.replace("/works/", "").trim();
  const title = doc.title?.trim();

  if (!key || !title) return null;

  const cover = doc.cover_i
    ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
    : null;

  return {
    id: key,
    title,
    author: doc.author_name?.[0]?.trim() || "Autore sconosciuto",
    year: doc.first_publish_year ?? null,
    publisher: doc.publisher?.[0]?.trim() ?? null,
    pages: doc.number_of_pages_median ?? null,
    cover,
    categories: (doc.subject ?? []).slice(0, 5),
    description: "",
    source: "openlibrary",
  };
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() || "";

  if (query.length < 2) {
    return NextResponse.json(
      { error: "La query deve contenere almeno 2 caratteri." },
      { status: 400 }
    );
  }

  const url = new URL("https://openlibrary.org/search.json");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", "20");
  url.searchParams.set("language", "ita");

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Open Library non disponibile." },
        { status: 502 }
      );
    }

    const payload = (await response.json()) as { docs?: OpenLibraryDoc[] };
    const results = (payload.docs ?? [])
      .map(mapDocToResult)
      .filter((result): result is SearchResult => Boolean(result));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json(
      { error: "Errore durante la ricerca su Open Library." },
      { status: 500 }
    );
  }
}

