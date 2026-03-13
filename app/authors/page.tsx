import { AuthorsPageClient } from "@/components/authors/authors-page-client";
import { getLibraryAuthorsFromOpenLibrary } from "@/lib/open-library-authors";

export default async function AuthorsPage() {
  const authors = await getLibraryAuthorsFromOpenLibrary();
  return (
    <div className="mx-auto w-full space-y-6">
      <AuthorsPageClient authors={authors} />
    </div>
  );
}
