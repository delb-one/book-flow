import { AuthorsPageClient } from "@/components/authors/authors-page-client";
import { getLibraryBooks } from "@/lib/library-data";

export default async function AuthorsPage() {
  const books = await getLibraryBooks();
  const authors = Object.values(
    books.reduce<
      Record<string, { slug: string; name: string; books: typeof books }>
    >((acc, book) => {
      if (!acc[book.authorSlug]) {
        acc[book.authorSlug] = {
          slug: book.authorSlug,
          name: book.author,
          books: [],
        };
      }

      acc[book.authorSlug].books.push(book);
      return acc;
    }, {}),
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="mx-auto w-full space-y-6">
      <header className="">
        <h1 className="text-3xl font-semibold tracking-tight">Autori</h1>
        <p className="text-muted-foreground">
          Esplora gli autori presenti nella tua libreria personale.
        </p>
      </header>

      <AuthorsPageClient authors={authors} />
    </div>
  );
}
