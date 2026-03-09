"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const navItems = [
  { label: "Dashboard", icon: BookOpen, href: "/" },
  { label: "La mia libreria", icon: BookCopy, href: "/my-library" },
  { label: "Scopri libri", icon: Compass, href: "#" },
  { label: "Autori", icon: Users, href: "#" },
  { label: "Statistiche lettura", icon: BarChart3, href: "#" },
  { label: "Impostazioni", icon: Settings, href: "#" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="bg-background h-screen overflow-hidden">
      <div className="grid h-full md:grid-cols-[240px_1fr]">
        <aside className="bg-card/60 border-r p-4 md:h-screen md:overflow-y-auto md:p-6">
          <div className="mb-8 flex items-center gap-2">
            <div className="bg-primary size-8 rounded-md" />
            <p className="text-lg font-semibold">BookFlow</p>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.href !== "#" && pathname === item.href;

              return (
                <Button
                  key={item.label}
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 size-4" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </aside>

        <main className="flex min-h-0 flex-col">
          <header className="bg-background/95 supports-backdrop-filter:bg-background/75 sticky top-0 z-20 border-b p-4 backdrop-blur md:px-8 md:py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full max-w-xl">
              <Search className="text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2" />
              <Input className="pl-8" placeholder="Cerca libri, autori, categorie..." />
            </div>
            <div className="flex items-center gap-2">
              <Button>
                <Plus className="size-4" />
                Aggiungi libro
              </Button>
              <ModeToggle />
            </div>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
