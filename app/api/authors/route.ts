import { NextRequest, NextResponse } from "next/server";

import { getLibraryAuthorsFromOpenLibrary } from "@/lib/open-library-authors";
import type { AuthorsResponse } from "@/types/authors";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  try {
    const authors = await getLibraryAuthorsFromOpenLibrary();
    const filtered =
      query.length >= 2
        ? authors.filter((author) =>
            author.name.toLowerCase().includes(query.toLowerCase()),
          )
        : authors;

    const payload: AuthorsResponse = {
      authors: filtered,
      total: filtered.length,
      query,
    };
    console.log(payload);
    

    return NextResponse.json(payload);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Errore durante il recupero autori.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
