import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

import { createServerSupabaseClient } from "@/lib/supabase/server";

const CUSTOM_COVER_BUCKET = "personal-book-covers";
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const bookId = formData.get("bookId");
  const file = formData.get("file");

  if (typeof bookId !== "string" || !bookId.trim()) {
    return NextResponse.json(
      { error: "Campo obbligatorio mancante (bookId)." },
      { status: 400 },
    );
  }

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Campo obbligatorio mancante (file)." },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "File troppo grande. Max 5MB." },
      { status: 400 },
    );
  }

  const extension = ALLOWED_MIME_TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "Formato file non supportato." },
      { status: 400 },
    );
  }

  const objectPath = `library/${bookId}/cover.${extension}`;
  const supabase = createServerSupabaseClient();

  try {
    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from(CUSTOM_COVER_BUCKET)
      .upload(objectPath, Buffer.from(arrayBuffer), {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: "Errore nel caricamento della cover." },
        { status: 500 },
      );
    }

    const { data: updatedRow, error: updateError } = await supabase
      .from("library_books")
      .update({ custom_cover: objectPath })
      .eq("book_id", bookId)
      .select("id")
      .maybeSingle();

    if (updateError) {
      return NextResponse.json(
        { error: "Errore nell'aggiornamento della cover." },
        { status: 500 },
      );
    }

    if (!updatedRow?.id) {
      return NextResponse.json(
        { error: "Libro non trovato in libreria." },
        { status: 404 },
      );
    }

    revalidateTag("library-books", "max");

    return NextResponse.json({ ok: true, path: objectPath });
  } catch {
    return NextResponse.json(
      { error: "Errore imprevisto durante il caricamento." },
      { status: 500 },
    );
  }
}
