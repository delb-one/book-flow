import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";

import { Links } from "@/components/authors/author/links";
import { Stats } from "./stats";

type InfoProps = {
  authorName: string;
  photoUrl: string | null;
  birthDate: string | null;
  deathDate: string | null;
  birthPlace: string | null;
  nationality: string | null;
  bio: string | null;
  wikipediaUrl: string | null;
  website: string | null;
  extraLinks: Array<{ title?: string; url: string }>;
  totalOwnedBooks: number;
  totalWishlistBooks: number;
  booksRead: number;
  averageRating: number | null;
};

export function Info({
  authorName,
  photoUrl,
  birthDate,
  deathDate,
  birthPlace,
  nationality,
  bio,
  wikipediaUrl,
  website,
  extraLinks,
  totalOwnedBooks,
  totalWishlistBooks,
  booksRead,
  averageRating,
}: InfoProps) {
  return (
    <section className="w-full lg:w-3/5 flex flex-col gap-6 rounded-3xl bg-muted/30 p-6 lg:flex-row lg:items-start lg:gap-8">
      <div className="relative mx-auto size-28 shrink-0 overflow-hidden rounded-full border-4 border-white bg-muted shadow-[0_8px_24px_rgba(15,23,42,0.12)] md:mx-0">
        <Image
          src={photoUrl ?? "/images/author-placeholder.svg"}
          alt={`Ritratto di ${authorName}`}
          fill
          className="object-cover"
          sizes="112px"
        />
      </div>

      <div className="flex w-full flex-col gap-6 lg:items-start lg:justify-between">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {authorName}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                <span>
                  {birthDate ?? "Data di nascita non disponibile"}
                  {deathDate ? ` — ${deathDate}` : ""}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="size-4" />
                <span>
                  {birthPlace ?? "Luogo di nascita non disponibile"}
                  {nationality && ` (${nationality})`}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-muted/30 p-2">
            <p className="text-sm md:text-base leading-relaxed text-muted-foreground md:max-w-3xl">
              {bio ?? "Dati biografici non disponibili"}
            </p>
          </div>

          <Links
            wikipediaUrl={wikipediaUrl}
            website={website}
            extraLinks={extraLinks}
          />
          <Stats
            totalOwnedBooks={totalOwnedBooks}
            totalWishlistBooks={totalWishlistBooks}
            booksRead={booksRead}
            averageRating={averageRating}
          />
        </div>
      </div>
    </section>
  );
}
