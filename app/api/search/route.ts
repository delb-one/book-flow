import { NextRequest, NextResponse } from "next/server";

import { getLibraryBooks } from "@/lib/library-data";

type SearchResult = {
  id: string;
  title: string;
  author: string;
  cover: string | null;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return NextResponse.json({ results: [] as SearchResult[] });
  }

  try {
    const books = await getLibraryBooks();
    const normalized = query.toLowerCase();
    const results = books
      .filter((book) => {
        const title = book.title.toLowerCase();
        const author = book.author.toLowerCase();
        return title.includes(normalized) || author.includes(normalized);
      })
      .slice(0, 8)
      .map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        cover: book.cover,
      }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Library search failed:", error);
    const message =
      error instanceof Error ? error.message : "Errore imprevisto.";
    return NextResponse.json(
      {
        results: [] as SearchResult[],
        error:
          process.env.NODE_ENV === "production"
            ? "Errore nel recupero dei libri."
            : message,
      },
      { status: 500 },
    );
  }
}
