"use client";

import Link from "next/link";
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
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: BookOpen, href: "/" },
  { label: "La mia libreria", icon: BookCopy, href: "/my-library" },
  { label: "Scopri libri", icon: Compass, href: "/discover" },
  { label: "Autori", icon: Users, href: "/authors" },
  { label: "Categorie", icon: Book, href: "/categories" },
  // { label: "Statistiche lettura", icon: BarChart3, href: "#" },
  // { label: "Impostazioni", icon: Settings, href: "#" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    for (const item of navItems) {
      if (item.href !== "#") {
        router.prefetch(item.href);
      }
    }
  }, [router]);

  return (
    <div className="bg-background h-screen overflow-hidden">
      <TooltipProvider delayDuration={150}>
        <div
          className={cn(
            "grid h-full md:grid-cols-[240px_1fr]",
            isCollapsed && "md:grid-cols-[80px_1fr]",
          )}
        >
          <aside
            className={cn(
              "bg-card/60 border-r md:h-screen md:overflow-y-auto md:p-6",
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
                <div className="relative w-full min-w-0 max-w-xl">
                  {/* <Search className="text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2" />
              <Input className="pl-8" placeholder="Cerca libri, autori, categorie..." /> */}
                  <Button
                    variant="outline"
                    size="icon"
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
