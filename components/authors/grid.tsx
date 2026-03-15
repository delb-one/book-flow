import type { AuthorCard as AuthorCardType } from "@/types/authors";
import { AuthorCard } from "@/components/authors/card";

type GridProps = {
  authors: AuthorCardType[];
};

export function Grid({ authors }: GridProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {authors.map((author) => (
        <AuthorCard key={author.slug} author={author} />
      ))}
    </section>
  );
}
