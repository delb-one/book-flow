import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import { createServerSupabaseClient } from "@/lib/supabase/server";

type DeleteBookPayload = {
  bookId: string;
};

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as DeleteBookPayload;

  if (!payload?.bookId) {
    return NextResponse.json(
      { error: "Campo obbligatorio mancante (bookId)." },
      { status: 400 },
    );
  }

  const supabase = createServerSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("library_books")
      .delete()
      .eq("book_id", payload.bookId)
      .select("id");

    if (error) {
      return NextResponse.json(
        { error: "Errore durante la rimozione dalla libreria." },
        { status: 500 },
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Libro non trovato in libreria." },
        { status: 404 },
      );
    }

    revalidateTag("library-books", "max");

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Errore imprevisto durante la rimozione." },
      { status: 500 },
    );
  }
}
