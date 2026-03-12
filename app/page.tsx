import { BookReadingCard } from "@/components/dashboard/book-reading-card";
import { BookSmallCard } from "@/components/dashboard/book-small-card";
import { SectionHeader } from "@/components/dashboard/section-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLibraryBooks } from "@/lib/library-data";
import { Book, BookCheck, BookOpen, Bookmark } from "lucide-react";
import Link from "next/link";



export const statusVariant = {
  unread: "muted",
  reading: "warning",
  read: "success",
  wishlist: "outline",
} as const;

export const statusLabel = {
  unread: "Non letto",
  reading: "In lettura",
  read: "Letto",
  wishlist: "Da comprare",
} as const;

export default async function Home() {
  const books = await getLibraryBooks();
  const stats = {
    total: books.filter((book) => book.status !== "wishlist").length,
    read: books.filter((book) => book.status === "read").length,
    reading: books.filter((book) => book.status === "reading").length,
    unread: books.filter((book) => book.status === "unread").length,
    wishlist: books.filter((book) => book.status === "wishlist").length,
  };
  const currentlyReading = books.filter((book) => book.status === "reading");
  const recentlyAdded = [...books]
    .sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1))
    .slice(0, 5);

  return (
    <>
      <section className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardDescription className="text-sm">
                  Libri posseduti
                </CardDescription>
                <CardTitle className="font-bold text-2xl">
                  {stats.total}
                </CardTitle>
              </div>
              <Book className="size-5 text-primary" aria-hidden />
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardDescription className="text-sm">
                  Libri letti
                </CardDescription>
                <CardTitle className="font-bold text-2xl">
                  {stats.read}
                </CardTitle>
              </div>
              <BookCheck className="size-5 text-primary" aria-hidden />
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardDescription className="text-sm">Non letti</CardDescription>
                <CardTitle className="font-bold text-2xl">
                  {stats.unread}
                </CardTitle>
              </div>
              <BookOpen className="size-5 text-primary" aria-hidden />
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardDescription className="text-sm">
                  Lista desideri
                </CardDescription>
                <CardTitle className="font-bold text-2xl">
                  {stats.wishlist}
                </CardTitle>
              </div>
              <Bookmark className="size-5 text-primary" aria-hidden />
            </div>
          </CardHeader>
        </Card>
      </section>

      <section className="flex flex-col gap-6">
        <SectionHeader
          title="In lettura"
          description="Tieni traccia dei progressi dei libri in corso"
          badge={currentlyReading.length}
          book={{ status: "reading" }}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {currentlyReading.map((book) => (
            <BookReadingCard key={book.id} book={book} />
          ))}
        </div>

        <SectionHeader
          title="Aggiunti di recente"
          description="Gli ultimi libri della tua libreria personale"
          action={
            <Button variant="link" size="sm">
              <Link href="/my-library">Vai alla libreria</Link>
            </Button>
          }
        />

        <div className="flex flex-wrap gap-4">
          {recentlyAdded.map((book) => (
            <BookSmallCard key={book.id} book={book} />
          ))}
        </div>
      </section>
    </>
  );
}
