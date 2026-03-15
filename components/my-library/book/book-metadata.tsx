import { Card, CardContent } from "@/components/ui/card";

type BookMetadataProps = {
  publisher: string | null;
  year: number | null;
  pages: number | null;
};

export function BookMetadata({ publisher, year, pages }: BookMetadataProps) {
  return (
    <Card>
      <CardContent className="grid gap-4 py-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-semibold uppercase">
            Editore
          </p>
          <p className="text-sm font-medium">{publisher || "-"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-semibold uppercase">
            Anno
          </p>
          <p className="text-sm font-medium">{year || "-"}</p>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-semibold uppercase">
            Pagine
          </p>
          <p className="text-sm font-medium">{pages ? `${pages}` : "-"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
