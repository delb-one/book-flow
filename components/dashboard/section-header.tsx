import { statusVariant } from "@/app/page";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  badge?: number;
  action?: ReactNode;
  book?: {
    status: "unread" | "reading" | "read"| "wishlist";
  };
}

export function SectionHeader({
  title,
  description,
  badge,
  action,
  book,
}: SectionHeaderProps) {
  return (
    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 ">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="leading-none font-bold">{title}</h1>

          {badge !== undefined && (
            <Badge variant={statusVariant[book!.status]}>{badge}</Badge>
          )}
        </div>

        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>

      {action && <div className="self-start sm:self-auto">{action}</div>}
    </div>
  );
}
