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

  const filename = `${crypto.randomUUID()}.${extension}`;
  const objectPath = `library/${bookId}/${filename}`;
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

    const { data: lastPositionRow, error: positionError } = await supabase
      .from("library_book_covers")
      .select("position")
      .eq("book_id", bookId)
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (positionError) {
      return NextResponse.json(
        { error: "Errore nel recupero della posizione cover." },
        { status: 500 },
      );
    }

    const position = (lastPositionRow?.position ?? -1) + 1;

    const { error: insertError } = await supabase
      .from("library_book_covers")
      .insert({
        id: crypto.randomUUID(),
        book_id: bookId,
        path: objectPath,
        position,
      });

    if (insertError) {
      return NextResponse.json(
        { error: "Errore nel salvataggio della cover." },
        { status: 500 },
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
