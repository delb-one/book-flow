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
    let { data: existingAuthor, error: authorSelectError } = await supabase
      .from("authors")
      .select(
        "id, openlibrary_key, bio, photo_url, wikipedia_url, birth_date, birth_place, death_date, nationality, website, links",
      )
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
          photo_url: null,
          wikipedia_url: null,
          birth_date: null,
          birth_place: null,
          death_date: null,
          nationality: null,
          website: null,
          links: null,
          openlibrary_key: payload.authorKey ?? null,
        })
        .select(
          "id, openlibrary_key, bio, photo_url, wikipedia_url, birth_date, birth_place, death_date, nationality, website, links",
        )
        .single();

      if (authorInsertError) {
        return NextResponse.json(
          { error: "Errore nella creazione autore." },
          { status: 500 },
        );
      }

      authorId = createdAuthor.id as string;
      // Treat the freshly created author as existing for metadata enrichment.
      existingAuthor = createdAuthor as typeof existingAuthor;
    } else if (!existingAuthor?.openlibrary_key && payload.authorKey) {
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

    const authorUpdates: {
      bio?: string | null;
      wikipedia_url?: string | null;
      photo_url?: string | null;
      birth_date?: string | null;
      birth_place?: string | null;
      death_date?: string | null;
      nationality?: string | null;
      website?: string | null;
      links?: unknown | null;
    } = {};

    const openLibraryKey =
      payload.authorKey ?? existingAuthor?.openlibrary_key ?? null;
    const openLibraryData = openLibraryKey
      ? await getOpenLibraryAuthor(openLibraryKey)
      : null;

    if (!existingAuthor?.birth_date && openLibraryData?.birthDate) {
      authorUpdates.birth_date = openLibraryData.birthDate;
    }
    if (!existingAuthor?.death_date && openLibraryData?.deathDate) {
      authorUpdates.death_date = openLibraryData.deathDate;
    }
    if (!existingAuthor?.links && openLibraryData?.links) {
      authorUpdates.links = openLibraryData.links;
    }
    if (!existingAuthor?.website && openLibraryData?.website) {
      authorUpdates.website = openLibraryData.website;
    }
    if (!existingAuthor?.wikipedia_url && openLibraryData?.wikipediaUrl) {
      authorUpdates.wikipedia_url = openLibraryData.wikipediaUrl;
    }

    const wikiSummaryNeeded =
      !existingAuthor?.bio || !existingAuthor?.wikipedia_url || !existingAuthor?.photo_url;
    const metadata = wikiSummaryNeeded
      ? await getWikipediaSummary(payload.author)
      : null;

    if (!existingAuthor?.bio && metadata?.bio) {
      authorUpdates.bio = metadata.bio;
    }
    if (!existingAuthor?.wikipedia_url && metadata?.url) {
      authorUpdates.wikipedia_url = metadata.url;
    }
    if (!existingAuthor?.photo_url && metadata?.photoUrl) {
      authorUpdates.photo_url = metadata.photoUrl;
    }

    const needsWikidata =
      !existingAuthor?.birth_date ||
      !existingAuthor?.birth_place ||
      !existingAuthor?.death_date ||
      !existingAuthor?.nationality ||
      !existingAuthor?.website;

    if (needsWikidata) {
      const wikipediaUrl =
        existingAuthor?.wikipedia_url ??
        authorUpdates.wikipedia_url ??
        openLibraryData?.wikipediaUrl ??
        metadata?.url ??
        null;

      const wikidataDetails = await getWikidataDetails({
        authorName: payload.author,
        wikipediaUrl,
      });

      if (!existingAuthor?.birth_date && wikidataDetails?.birthDate) {
        authorUpdates.birth_date = wikidataDetails.birthDate;
      }
      if (!existingAuthor?.death_date && wikidataDetails?.deathDate) {
        authorUpdates.death_date = wikidataDetails.deathDate;
      }
      if (!existingAuthor?.birth_place && wikidataDetails?.birthPlace) {
        authorUpdates.birth_place = wikidataDetails.birthPlace;
      }
      if (!existingAuthor?.nationality && wikidataDetails?.nationality) {
        authorUpdates.nationality = wikidataDetails.nationality;
      }
      if (!existingAuthor?.website && wikidataDetails?.website) {
        authorUpdates.website = wikidataDetails.website;
      }
    }

    if (authorId && Object.keys(authorUpdates).length > 0) {
      await supabase.from("authors").update(authorUpdates).eq("id", authorId);
      revalidateTag("library-authors", "max");
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

async function getWikipediaSummary(authorName: string) {
  const title = encodeURIComponent(authorName.trim().replace(/\s+/g, "_"));
  if (!title) return null;

  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`,
      { next: { revalidate: 60 * 60 * 24 } },
    );

    if (!response.ok) return null;

    const payload = (await response.json()) as {
      extract?: string;
      content_urls?: {
        desktop?: {
          page?: string;
        };
      };
      thumbnail?: {
        source?: string;
      };
      originalimage?: {
        source?: string;
      };
    };

    const bio = payload.extract?.trim() ?? null;
    const url = payload.content_urls?.desktop?.page ?? null;
    const photoUrl =
      payload.originalimage?.source ?? payload.thumbnail?.source ?? null;

    if (!bio && !url && !photoUrl) return null;

    return {
      bio,
      url,
      photoUrl,
    };
  } catch {
    return null;
  }
}

type OpenLibraryAuthorData = {
  birthDate: string | null;
  deathDate: string | null;
  links: { title?: string; url: string }[] | null;
  website: string | null;
  wikipediaUrl: string | null;
};

async function getOpenLibraryAuthor(
  openLibraryKey: string,
): Promise<OpenLibraryAuthorData | null> {
  if (!openLibraryKey) return null;

  try {
    const response = await fetch(
      `https://openlibrary.org/authors/${openLibraryKey}.json`,
      { next: { revalidate: 60 * 60 * 24 } },
    );

    if (!response.ok) return null;

    const payload = (await response.json()) as {
      birth_date?: string;
      death_date?: string;
      links?: { title?: string; url?: string }[];
      wikipedia?: string;
    };

    const links =
      payload.links
        ?.map((link) =>
          link.url ? { title: link.title, url: link.url } : null,
        )
        .filter((link): link is { title: string | undefined; url: string } =>
          Boolean(link?.url),
        ) ?? null;

    return {
      birthDate: normalizeDate(payload.birth_date ?? null),
      deathDate: normalizeDate(payload.death_date ?? null),
      links,
      website: links?.[0]?.url ?? null,
      wikipediaUrl: payload.wikipedia ?? null,
    };
  } catch {
    return null;
  }
}

type WikidataDetails = {
  birthDate: string | null;
  deathDate: string | null;
  birthPlace: string | null;
  nationality: string | null;
  website: string | null;
};

async function getWikidataDetails({
  authorName,
  wikipediaUrl,
}: {
  authorName: string;
  wikipediaUrl: string | null;
}): Promise<WikidataDetails | null> {
  const title = wikipediaUrl
    ? decodeURIComponent(
        wikipediaUrl.split("/wiki/").pop() ?? authorName,
      ).replace(/_/g, " ")
    : authorName;

  const wikibaseItem = await getWikibaseItemFromTitle(title);
  if (!wikibaseItem) return null;

  const entity = await getWikidataEntity(wikibaseItem);
  if (!entity?.claims) return null;
  const claims = entity.claims as Record<string, unknown>;

  const birthDate = normalizeDate(extractWikidataTime(claims.P569));
  const deathDate = normalizeDate(extractWikidataTime(claims.P570));
  const website = extractWikidataWebsite(claims.P856);

  const placeId = extractWikidataEntityId(claims.P19);
  const nationalityId = extractWikidataEntityId(claims.P27);
  const labels = await getWikidataLabels(
    [placeId, nationalityId].filter(Boolean) as string[],
  );

  return {
    birthDate,
    deathDate,
    birthPlace: placeId ? labels[placeId] ?? null : null,
    nationality: nationalityId ? labels[nationalityId] ?? null : null,
    website,
  };
}

async function getWikibaseItemFromTitle(
  title: string,
): Promise<string | null> {
  if (!title.trim()) return null;

  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&format=json&titles=${encodeURIComponent(
        title,
      )}`,
      { next: { revalidate: 60 * 60 * 24 } },
    );

    if (!response.ok) return null;

    const payload = (await response.json()) as {
      query?: {
        pages?: Record<
          string,
          { pageprops?: { wikibase_item?: string } }
        >;
      };
    };

    const pages = payload.query?.pages ?? {};
    const page = Object.values(pages)[0];
    return page?.pageprops?.wikibase_item ?? null;
  } catch {
    return null;
  }
}

async function getWikidataEntity(
  id: string,
): Promise<{ claims?: Record<string, unknown> } | null> {
  try {
    const response = await fetch(
      `https://www.wikidata.org/wiki/Special:EntityData/${id}.json`,
      { next: { revalidate: 60 * 60 * 24 } },
    );
    if (!response.ok) return null;

    const payload = (await response.json()) as {
      entities?: Record<string, { claims?: Record<string, unknown> }>;
    };

    return payload.entities?.[id] ?? null;
  } catch {
    return null;
  }
}

async function getWikidataLabels(
  ids: string[],
): Promise<Record<string, string>> {
  if (ids.length === 0) return {};

  try {
    const response = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${ids.join(
        "|",
      )}&props=labels&languages=it|en&format=json`,
      { next: { revalidate: 60 * 60 * 24 } },
    );

    if (!response.ok) return {};

    const payload = (await response.json()) as {
      entities?: Record<
        string,
        { labels?: Record<string, { value?: string }> }
      >;
    };

    const result: Record<string, string> = {};
    for (const id of ids) {
      const labels = payload.entities?.[id]?.labels;
      const label = labels?.it?.value ?? labels?.en?.value ?? null;
      if (label) result[id] = label;
    }
    return result;
  } catch {
    return {};
  }
}

function extractWikidataTime(claims?: unknown): string | null {
  if (!Array.isArray(claims)) return null;
  const claim = claims[0] as {
    mainsnak?: { datavalue?: { value?: { time?: string } } };
  };
  return claim?.mainsnak?.datavalue?.value?.time ?? null;
}

function extractWikidataWebsite(claims?: unknown): string | null {
  if (!Array.isArray(claims)) return null;
  const claim = claims[0] as {
    mainsnak?: { datavalue?: { value?: string } };
  };
  return claim?.mainsnak?.datavalue?.value ?? null;
}

function extractWikidataEntityId(claims?: unknown): string | null {
  if (!Array.isArray(claims)) return null;
  const claim = claims[0] as {
    mainsnak?: { datavalue?: { value?: { id?: string } } };
  };
  return claim?.mainsnak?.datavalue?.value?.id ?? null;
}

function normalizeDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}
