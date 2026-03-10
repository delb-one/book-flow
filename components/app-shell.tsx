"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  BookCopy,
  BookOpen,
  Compass,
  Plus,
  Users,
} from "lucide-react";

import { ModeToggle } from "@/components/theme-toggle";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

const navItems = [
  { label: "Dashboard", icon: BookOpen, href: "/" },
  { label: "La mia libreria", icon: BookCopy, href: "/my-library" },
  { label: "Scopri libri", icon: Compass, href: "/discover" },
  { label: "Autori", icon: Users, href: "/authors" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    for (const item of navItems) {
      router.prefetch(item.href);
    }
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          
          {/* LOGO */}
          <div className="flex items-center gap-2">
            <div className="bg-primary size-7 rounded-md" />
            <span className="font-semibold">BookFlow</span>
          </div>

          {/* MENUBAR */}
          <NavigationMenu>
            <NavigationMenuList className="flex gap-2">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <NavigationMenuItem key={item.href}>
                    <Button
                      asChild
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                    >
                      <Link href={item.href} className="flex items-center gap-2">
                        <item.icon className="size-4" />
                        {item.label}
                      </Link>
                    </Button>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* ACTIONS */}
          <div className="flex items-center gap-2">
            <Button asChild size="sm">
              <Link href="/discover" className="flex items-center gap-2">
                <Plus className="size-4" />
                Aggiungi libro
              </Link>
            </Button>

            <ModeToggle />
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}