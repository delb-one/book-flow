import { NextRequest, NextResponse } from "next/server";

type OpenLibraryDoc = {
  key?: string;
  title?: string;
  author_name?: string[];
  author_key?: string[];
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
  authorKey: string | null;
  year: number | null;
  publisher: string | null;
  pages: number | null;
  cover: string | null;
  categories: string[];
  description: string;
  source: "openlibrary";
};

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
    authorKey: doc.author_key?.[0] ?? null,
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

      if (!result.categories && work.subjects) {
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

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() || "";

  if (query.length < 2) {
    return NextResponse.json(
      { error: "La query deve contenere almeno 2 caratteri." },
      { status: 400 },
    );
  }

  const url = new URL("https://openlibrary.org/search.json");

  url.searchParams.set("q", query);
  url.searchParams.set("limit", "100");
  url.searchParams.set(
    "fields",
    "key,title,author_name,author_key,first_publish_year,publisher,subject,cover_i,number_of_pages_median",
  );
  url.searchParams.set("mode", "everything");

  try {
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
      .filter((r): r is SearchResult => Boolean(r));

    const enriched = await Promise.all(mapped.map(enrichWork));

    // console.log(enriched);

    return NextResponse.json({ results: enriched });
  } catch {
    return NextResponse.json(
      { error: "Errore durante la ricerca su Open Library." },
      { status: 500 },
    );
  }
}
