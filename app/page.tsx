import {
  BarChart3,
  BookCopy,
  BookOpen,
  Compass,
  Plus,
  Search,
  Settings,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { books, stats } from "@/lib/mock-data";
import { ModeToggle } from "@/components/theme-toggle";

const navItems = [
  { label: "Dashboard", icon: BookOpen, active: true },
  { label: "La mia libreria", icon: BookCopy },
  { label: "Scopri libri", icon: Compass },
  { label: "Autori", icon: Users },
  { label: "Statistiche lettura", icon: BarChart3 },
  { label: "Impostazioni", icon: Settings },
];

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
    <div className="bg-background min-h-screen">
      <div className="grid min-h-screen md:grid-cols-[240px_1fr]">
        <aside className="bg-card/60 border-r p-4 md:p-6">
          <div className="mb-8 flex items-center gap-2">
            <div className="bg-primary size-8 rounded-md" />
            <p className="text-lg font-semibold">BookFlow</p>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.label}
                variant={item.active ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <item.icon className="mr-2 size-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </aside>

        <main className="p-4 md:p-8">
          <header className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full max-w-xl">
              <Search className="text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2" />
              <Input
                className="pl-8"
                placeholder="Cerca libri, autori, categorie..."
              />
            </div>
            <div className="flex items-center gap-2">
              <Button>
                <Plus className="size-4" />
                Aggiungi libro
              </Button>
              {/* <Button variant="outline" size="icon" aria-label="User menu">
                <UserRound className="size-4" />
              </Button> */}
              <ModeToggle />
            </div>
          </header>

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
                      <p className="truncate text-sm font-medium">
                        {book.title}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {book.author}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
