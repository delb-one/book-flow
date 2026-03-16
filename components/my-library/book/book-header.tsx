import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type BookHeaderProps = {
  title: string;
  author: string;
  authorSlug: string;
  categories: string[];
};

export function BookHeader({
  title,
  author,
  authorSlug,
  categories,
}: BookHeaderProps) {
  return (
    <header className="space-y-2">
      <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>

      <p className="text-muted-foreground text-sm">
        di
        <Button asChild variant="link" className="pl-1 h-auto">
          <Link href={`/authors/${authorSlug}`}>
            <span className="font-semibold text-foreground">{author}</span>
          </Link>
        </Button>
      </p>

      <div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge key={category} variant="outline">
              {category}
            </Badge>
          ))}
        </div>
      </div>
    </header>
  );
}
