"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  BookCopy,
  BookOpen,
  Compass,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Settings,
  Users,
  Book,
  X,
} from "lucide-react";

import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, slugify } from "@/lib/utils";

type LibrarySearchResult = {
  id: string;
  title: string;
  author: string;
  cover: string | null;
};

const navItems = [
  { label: "Dashboard", icon: BookOpen, href: "/" },
  { label: "La mia libreria", icon: BookCopy, href: "/my-library" },
  { label: "Scopri libri", icon: Compass, href: "/discover" },
  { label: "Autori", icon: Users, href: "/authors" },
  { label: "Categorie", icon: Book, href: "/categories" },
  { label: "Statistiche lettura", icon: BarChart3, href: "/stats" },
  { label: "Impostazioni", icon: Settings, href: "/settings" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<LibrarySearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);

  useEffect(() => {
    for (const item of navItems) {
      if (item.href !== "#") {
        router.prefetch(item.href);
      }
    }
  }, [router]);

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      setSearchError(false);
      return;
    }

    setIsSearching(true);
    setSearchError(false);

    let isActive = true;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );

        console.log(response);

        if (!response.ok) throw new Error("Search request failed.");
        const payload = (await response.json()) as {
          results?: LibrarySearchResult[];
        };

        if (!isActive) return;
        setSearchResults(payload.results ?? []);
      } catch (error) {
        if (!isActive) return;
        if ((error as DOMException).name === "AbortError") return;
        setSearchError(true);
        setSearchResults([]);
      } finally {
        if (isActive) setIsSearching(false);
      }
    }, 250);

    return () => {
      isActive = false;
      controller.abort();
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const showSearchPanel = searchQuery.trim().length >= 2;

  return (
    <div className="bg-background h-screen overflow-hidden">
      <TooltipProvider delayDuration={150}>
        <div
          className={cn(
            "grid h-full transition-[grid-template-columns] duration-300 ease-out md:grid-cols-[240px_1fr]",
            isCollapsed && "md:grid-cols-[80px_1fr]",
          )}
        >
          <aside
            className={cn(
              "bg-card/60 border-r transition-[padding] duration-300 ease-out md:h-screen md:overflow-y-auto md:p-6",
              isCollapsed && "md:px-3",
            )}
          >
            <div
              className={cn(
                "mb-8 flex items-center gap-2",
                isCollapsed && "justify-center",
              )}
            >
              <Book className="size-6 text-primary" />
              {!isCollapsed && (
                <p className="text-lg font-semibold">BookFlow</p>
              )}
            </div>
            <nav className={cn("space-y-1", isCollapsed && "space-y-2")}>
              {navItems.map((item) => {
                const isActive =
                  item.href !== "#" &&
                  (pathname === item.href ||
                    (item.href !== "/" &&
                      pathname.startsWith(`${item.href}/`)));

                const navButton = (
                  <Button
                    asChild
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isCollapsed && "px-0 justify-center",
                    )}
                  >
                    <Link href={item.href}>
                      <item.icon
                        className={cn("mr-2 size-4", isCollapsed && "mr-0")}
                      />
                      {!isCollapsed && item.label}
                    </Link>
                  </Button>
                );

                return isCollapsed ? (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>{navButton}</TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                ) : (
                  <div key={item.label}>{navButton}</div>
                );
              })}
            </nav>
          </aside>

          <main className="flex min-h-0 flex-col">
            <header className="bg-background/95 supports-backdrop-filter:bg-background/75 sticky top-0 z-20 border-b p-4 backdrop-blur md:px-8 md:py-4">
              <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center w-full min-w-0 max-w-xl gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    aria-label={
                      isCollapsed ? "Espandi sidebar" : "Comprimi sidebar"
                    }
                    onClick={() => setIsCollapsed((current) => !current)}
                  >
                    {isCollapsed ? (
                      <PanelLeftOpen className="size-4" />
                    ) : (
                      <PanelLeftClose className="size-4" />
                    )}
                  </Button>

                  <div className="relative flex-1">
                    <Search className="text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2" />
                    <Input
                      className="pl-8 w-full"
                      placeholder="Cerca nella mia libreria..."
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Escape") {
                          setSearchQuery("");
                        }
                      }}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 transition-colors"
                      >
                        <X className="size-4" />
                      </button>
                    )}

                    {showSearchPanel ? (
                      <div className="absolute left-0 right-0 top-full z-30 mt-2">
                        <div className="rounded-xl border bg-popover/95 shadow-lg backdrop-blur">
                          {isSearching ? (
                            <div className="px-4 py-3 text-sm text-muted-foreground">
                              Sto cercando nella tua libreria...
                            </div>
                          ) : null}

                          {searchError ? (
                            <div className="px-4 py-3 text-sm text-destructive">
                              Non riesco a caricare i risultati in questo
                              momento.
                            </div>
                          ) : null}

                          {!isSearching && !searchError ? (
                            searchResults.length > 0 ? (
                              <div className="max-h-80 overflow-auto">
                                {searchResults.map((book) => (
                                  <Link
                                    key={book.id}
                                    href={`/my-library/${slugify(book.title)}`}
                                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/60"
                                    onClick={() => setSearchQuery("")}
                                  >
                                    {book.cover ? (
                                      <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-md border bg-muted">
                                        <Image
                                          src={book.cover}
                                          alt={`Copertina di ${book.title}`}
                                          fill
                                          className="object-cover"
                                          sizes="36px"
                                          unoptimized
                                        />
                                      </div>
                                    ) : (
                                      <div className="flex h-12 w-9 shrink-0 items-center justify-center rounded-md border bg-muted text-[10px] text-muted-foreground">
                                        N/A
                                      </div>
                                    )}
                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-medium">
                                        {book.title}
                                      </p>
                                      <p className="text-muted-foreground truncate text-xs">
                                        {book.author}
                                      </p>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            ) : (
                              <div className="px-4 py-3 text-sm text-muted-foreground">
                                Nessun risultato trovato.
                              </div>
                            )
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button asChild className="w-full sm:w-auto">
                    <Link href="/discover">
                      <Plus className="size-4" />
                      Aggiungi libro
                    </Link>
                  </Button>
                  <ModeToggle />
                </div>
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-auto p-4 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </TooltipProvider>
    </div>
  );
}
