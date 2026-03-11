import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ReadingStatus } from "@/lib/library-data";

type UpdateBookPayload = {
  bookId: string;
  status?: ReadingStatus;
  rating?: number;
  notes?: string;
};

const allowedStatuses: ReadonlySet<ReadingStatus> = new Set([
  "unread",
  "reading",
  "read",
  "wishlist",
]);

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as UpdateBookPayload;

  if (!payload?.bookId) {
    return NextResponse.json(
      { error: "Campo obbligatorio mancante (bookId)." },
      { status: 400 },
    );
  }

  const updateFields: Record<string, unknown> = {};

  if (payload.status !== undefined) {
    if (!allowedStatuses.has(payload.status)) {
      return NextResponse.json(
        { error: "Valore status non valido." },
        { status: 400 },
      );
    }
    updateFields.status = payload.status;
  }

  if (payload.rating !== undefined) {
    if (!Number.isFinite(payload.rating) || payload.rating < 0 || payload.rating > 5) {
      return NextResponse.json(
        { error: "Valore rating non valido." },
        { status: 400 },
      );
    }
    updateFields.rating = payload.rating;
  }

  if (payload.notes !== undefined) {
    if (typeof payload.notes !== "string") {
      return NextResponse.json(
        { error: "Valore notes non valido." },
        { status: 400 },
      );
    }
    updateFields.notes = payload.notes;
  }

  if (Object.keys(updateFields).length === 0) {
    return NextResponse.json(
      { error: "Nessun campo da aggiornare." },
      { status: 400 },
    );
  }

  const supabase = createServerSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("library_books")
      .update(updateFields)
      .eq("book_id", payload.bookId)
      .select("id");

    if (error) {
      return NextResponse.json(
        { error: "Errore nell'aggiornamento del libro." },
        { status: 500 },
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Libro non trovato in libreria." },
        { status: 404 },
      );
    }

    revalidateTag("library-books",'max');

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Errore imprevisto durante l'aggiornamento." },
      { status: 500 },
    );
  }
}
