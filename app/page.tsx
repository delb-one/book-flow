import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { books, stats } from "@/lib/mock-data";

const toneClass: Record<string, string> = {
  amber: "from-amber-200 to-amber-400",
  emerald: "from-emerald-200 to-emerald-500",
  rose: "from-rose-200 to-rose-500",
  indigo: "from-indigo-200 to-indigo-500",
  cyan: "from-cyan-200 to-cyan-500",
  slate: "from-slate-200 to-slate-500",
};

const currentlyReading = books.filter((book) => book.status === "reading");
const recentlyAdded = [...books]
  .sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1))
  .slice(0, 5);

const statusVariant = {
  unread: "muted",
  reading: "warning",
  read: "success",
} as const;

const statusLabel = {
  unread: "Da leggere",
  reading: "In lettura",
  read: "Letto",
} as const;

export default function Home() {
  return (
    <>
      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Libri totali</CardDescription>
            <CardTitle>{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Libri letti</CardDescription>
            <CardTitle>{stats.read}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In lettura</CardDescription>
            <CardTitle>{stats.reading}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Da leggere</CardDescription>
            <CardTitle>{stats.unread}</CardTitle>
          </CardHeader>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>In lettura</CardTitle>
            <CardDescription>
              Tieni traccia dei progressi dei libri in corso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-6">
            {currentlyReading.map((book) => (
              <div
                key={book.id}
                className="flex items-center gap-4 rounded-lg border p-3"
              >
                <div
                  className={`h-16 w-12 rounded-md bg-linear-to-br ${toneClass[book.coverTone]}`}
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <p className="truncate font-medium">{book.title}</p>
                    <Badge variant={statusVariant[book.status]}>
                      {statusLabel[book.status]}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-2 text-sm">
                    {book.author}
                  </p>
                  <Progress value={book.progress} />
                </div>
                <span className="text-muted-foreground text-sm">
                  {book.progress}%
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aggiunti di recente</CardTitle>
            <CardDescription>
              Gli ultimi libri della tua libreria personale
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pb-6">
            {recentlyAdded.map((book) => (
              <div
                key={book.id}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <div
                  className={`h-14 w-10 rounded bg-linear-to-br ${toneClass[book.coverTone]}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{book.title}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {book.author}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
