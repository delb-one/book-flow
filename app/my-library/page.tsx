import { MyLibraryClient } from "@/components/my-library/my-library-client";
import { getLibraryBooks } from "@/lib/library-data";

export default async function MyLibraryPage() {
  const books = await getLibraryBooks();
  return <MyLibraryClient books={books} />;
}

