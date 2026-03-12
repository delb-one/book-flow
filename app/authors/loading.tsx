import { Card, CardContent, CardHeader } from "@/components/ui/card";

const gridItems = Array.from({ length: 8 }, (_, index) => index);

export default function Loading() {
  return (
    <div className="mx-auto w-full space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="h-10 w-full rounded-md bg-muted/60 animate-pulse lg:max-w-md" />
      </div>

      <div className="h-4 w-32 rounded bg-muted/60 animate-pulse" />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {gridItems.map((item) => (
          <Card key={item} className="transition-all">
            <CardHeader>
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="h-6 w-40 rounded bg-muted/60 animate-pulse" />
                <div className="h-6 w-16 rounded-full bg-muted/60 animate-pulse" />
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pb-6">
              <div className="flex items-end gap-2">
                <div className="h-24 w-16 rounded-md bg-muted/60 animate-pulse" />
                <div className="h-20 w-14 rounded-md bg-muted/60 animate-pulse" />
                <div className="h-20 w-14 rounded-md bg-muted/60 animate-pulse" />
                <div className="h-20 w-14 rounded-md bg-muted/60 animate-pulse" />
              </div>

              <div className="h-9 w-full rounded-md bg-muted/60 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="h-4 w-36 rounded bg-muted/60 animate-pulse" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-24 rounded bg-muted/60 animate-pulse" />
          <div className="h-8 w-24 rounded bg-muted/60 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
