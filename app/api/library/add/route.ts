import { NextRequest, NextResponse } from "next/server";
import type { PostgrestError } from "@supabase/supabase-js";
import { revalidateTag } from "next/cache";

import { createServerSupabaseClient } from "@/lib/supabase/server";

type AddBookPayload = {
  id: string;
  title: string;
  author: string;
  year?: number | null;
  publisher?: string | null;
  pages?: number | null;
  cover?: string | null;
  categories?: string[];
  description?: string | null;
  status?: "unread" | "reading" | "read";
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

function formatSupabaseError(stage: string, error: PostgrestError) {
  return {
    error: `Salvataggio fallito nello stage "${stage}".`,
    stage,
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  };
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as AddBookPayload;

  if (!payload?.id || !payload?.title || !payload?.author) {
    return NextResponse.json(
      { error: "Campi obbligatori mancanti (id, title, author)." },
      { status: 400 }
    );
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      {
        error:
          "SUPABASE_SERVICE_ROLE_KEY mancante in .env.local. Aggiungi la chiave service_role da Supabase > Settings > API e riavvia il server.",
      },
      { status: 500 }
    );
  }

  const supabase = createServerSupabaseClient();

  const authorSlug = slugify(payload.author);
  const status = payload.status ?? "unread";
  const rating = payload.rating ?? 0;
  const notes = payload.notes ?? "";
  const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { data: existingAuthor, error: authorSelectError } = await supabase
      .from("authors")
      .select("id")
      .eq("slug", authorSlug)
      .maybeSingle();

    if (authorSelectError) {
      return NextResponse.json(formatSupabaseError("authors.select", authorSelectError), {
        status: 500,
      });
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
        })
        .select("id")
        .single();

      if (authorInsertError) {
        return NextResponse.json(formatSupabaseError("authors.insert", authorInsertError), {
          status: 500,
        });
      }
      authorId = createdAuthor.id as string;
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
      { onConflict: "id" }
    );

    if (bookUpsertError) {
      return NextResponse.json(formatSupabaseError("books.upsert", bookUpsertError), {
        status: 500,
      });
    }

    const { data: existingLibraryBook, error: existingLibraryBookError } = await supabase
      .from("library_books")
      .select("id")
      .eq("book_id", payload.id)
      .maybeSingle();

    if (existingLibraryBookError) {
      return NextResponse.json(
        formatSupabaseError("library_books.select", existingLibraryBookError),
        { status: 500 }
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
      return NextResponse.json(formatSupabaseError("library_books.insert", libraryInsertError), {
        status: 500,
      });
    }

    revalidateTag("library-books");

    return NextResponse.json({ ok: true, alreadyInLibrary: false });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const isPermissionError =
      message.toLowerCase().includes("row-level security") ||
      message.toLowerCase().includes("permission denied") ||
      message.toLowerCase().includes("not allowed");

    if (isPermissionError && !hasServiceRole) {
      return NextResponse.json(
        {
          error:
            "Permessi Supabase insufficienti. Aggiungi SUPABASE_SERVICE_ROLE_KEY in .env.local oppure abilita policy insert/select/update per authors, books e library_books.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: "Errore imprevisto durante il salvataggio.",
        message,
      },
      { status: 500 }
    );
  }
}
