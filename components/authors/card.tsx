import Link from "next/link";
import Image from "next/image";

import type { AuthorCard } from "@/types/authors";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CardProps = {
  author: AuthorCard;
};

export function AuthorCard({ author }: CardProps) {
  return (
    <Link key={author.slug} href={`/authors/${author.slug}`}>
      <Card className="group h-full rounded-2xl border border-muted/70 bg-card/80 transition-all hover:-translate-y-0.5 hover:shadow-md">
        <CardHeader className="items-center gap-2 pb-2 pt-6 text-center">
          <div className="relative mx-auto size-20 overflow-hidden rounded-full border border-muted/60 bg-muted/40">
            <Image
              src={author.photoUrl ?? "/images/author-placeholder.svg"}
              alt={`Ritratto di ${author.name}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <CardTitle className="line-clamp-1 text-lg font-semibold">
            {author.name}
          </CardTitle>
          <div className="text-xs text-muted-foreground">
            {author.bookCount} Libri
          </div>
        </CardHeader>

        <CardContent className="pb-6">
          <div className="flex items-end justify-center gap-2">
            {author.covers.slice(0, 3).map((cover, index) => (
              <div
                key={`${author.id}-cover-${index}`}
                className="relative h-16 w-11 overflow-hidden rounded-md border border-muted/60 bg-linear-to-br from-muted/40 to-muted/80"
              >
                {cover ? (
                  <Image
                    src={cover}
                    alt={`Copertina di ${author.name}`}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                ) : (
                  <div className="h-full w-full bg-muted/60" />
                )}
              </div>
            ))}
            {author.covers.length === 0 && (
              <>
                <div className="h-16 w-11 rounded-md border border-muted/60 bg-muted/50" />
                <div className="h-16 w-11 rounded-md border border-muted/60 bg-muted/40" />
                <div className="h-16 w-11 rounded-md border border-muted/60 bg-muted/30" />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
