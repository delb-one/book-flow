import { AuthorsPageClient } from "@/components/authors/authors-page-client";

export default async function AuthorsPage() {
  return (
    <div className="mx-auto w-full space-y-6">
      <AuthorsPageClient />
    </div>
  );
}
