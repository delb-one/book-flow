import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import { createServerSupabaseClient } from "@/lib/supabase/server";

type AddBookPayload = {
  id: string;
  title: string;
  author: string;
  authorKey?: string | null;
  year?: number | null;
  publisher?: string | null;
  pages?: number | null;
  cover?: string | null;
  categories?: string[];
  description?: string | null;
  status?: "unread" | "reading" | "read" | "wishlist";
  rating?: number | null;
  notes?: string | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as AddBookPayload;

  if (!payload?.id || !payload?.title || !payload?.author) {
    return NextResponse.json(
      { error: "Campi obbligatori mancanti (id, title, author)." },
      { status: 400 },
    );
  }

  const supabase = createServerSupabaseClient();

  const authorSlug = slugify(payload.author);
  const status = payload.status ?? "unread";
  const rating = payload.rating ?? 0;
  const notes = payload.notes ?? "";

  try {
    const { data: existingAuthor, error: authorSelectError } = await supabase
      .from("authors")
      .select("id, openlibrary_key")
      .eq("slug", authorSlug)
      .maybeSingle();

    if (authorSelectError) {
      return NextResponse.json(
        { error: "Errore nel recupero autore." },
        { status: 500 },
      );
    }

    let authorId = existingAuthor?.id as string | undefined;

    if (!authorId) {
      const { data: createdAuthor, error: authorInsertError } = await supabase
        .from("authors")
        .insert({
          id: crypto.randomUUID(),
          name: payload.author,
          slug: authorSlug,
          bio: null,
          openlibrary_key: payload.authorKey ?? null,
        })
        .select("id")
        .single();

      if (authorInsertError) {
        return NextResponse.json(
          { error: "Errore nella creazione autore." },
          { status: 500 },
        );
      }

      authorId = createdAuthor.id as string;
    } else if (!existingAuthor.openlibrary_key && payload.authorKey) {
      const { error: authorUpdateError } = await supabase
        .from("authors")
        .update({ openlibrary_key: payload.authorKey })
        .eq("id", authorId);

      if (authorUpdateError) {
        return NextResponse.json(
          { error: "Errore nell'aggiornamento autore." },
          { status: 500 },
        );
      }
    }

    const { error: bookUpsertError } = await supabase.from("books").upsert(
      {
        id: payload.id,
        title: payload.title,
        author_id: authorId,
        year: payload.year ?? null,
        publisher: payload.publisher ?? null,
        pages: payload.pages ?? null,
        description: payload.description ?? "",
        cover: payload.cover ?? null,
        categories: payload.categories ?? [],
      },
      { onConflict: "id" },
    );

    if (bookUpsertError) {
      return NextResponse.json(
        { error: "Errore nel salvataggio libro." },
        { status: 500 },
      );
    }

    const { data: existingLibraryBook, error: existingLibraryBookError } =
      await supabase
        .from("library_books")
        .select("id")
        .eq("book_id", payload.id)
        .maybeSingle();

    if (existingLibraryBookError) {
      return NextResponse.json(
        { error: "Errore nel recupero libro libreria." },
        { status: 500 },
      );
    }

    if (existingLibraryBook?.id) {
      return NextResponse.json({
        ok: true,
        alreadyInLibrary: true,
      });
    }

    const { error: libraryInsertError } = await supabase
      .from("library_books")
      .insert({
        id: crypto.randomUUID(),
        book_id: payload.id,
        status,
        progress: status === "read" ? 100 : 0,
        rating,
        notes,
        added_at: new Date().toISOString().slice(0, 10),
      });

    if (libraryInsertError) {
      return NextResponse.json(
        { error: "Errore nell'inserimento in libreria." },
        { status: 500 },
      );
    }

    revalidateTag("library-books", "max");

    return NextResponse.json({ ok: true, alreadyInLibrary: false });
  } catch (error) {
    return NextResponse.json(
      { error: "Errore imprevisto durante il salvataggio." },
      { status: 500 },
    );
  }
}
