import { Card, CardContent, CardHeader } from "@/components/ui/card";

const gridItems = Array.from({ length: 8 }, (_, index) => index);

export default function Loading() {
  return (
    <div className="mx-auto w-full space-y-6">
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="h-10 w-full rounded-md bg-muted/60 animate-pulse lg:max-w-md" />
            <div className="h-10 w-40 rounded-md bg-muted/60 animate-pulse" />
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:flex-1 lg:flex-wrap lg:items-center">
              <div className="h-10 w-full rounded-md bg-muted/60 animate-pulse lg:w-50" />
              <div className="h-10 w-full rounded-md bg-muted/60 animate-pulse lg:w-50" />
              <div className="h-10 w-full rounded-md bg-muted/60 animate-pulse lg:w-50" />
            </div>
            <div className="h-10 w-full rounded-md bg-muted/60 animate-pulse lg:w-60" />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="h-4 w-28 rounded bg-muted/60 animate-pulse" />
            <div className="h-8 w-24 rounded bg-muted/60 animate-pulse" />
          </div>
        </CardHeader>

        <CardContent className="pb-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {gridItems.map((item) => (
              <div
                key={item}
                className="bg-card rounded-lg border p-3 shadow-xs"
              >
                <div className="mb-3 h-44 w-full rounded-md bg-muted/60 animate-pulse" />
                <div className="h-4 w-3/4 rounded bg-muted/60 animate-pulse" />
                <div className="mt-2 h-3 w-1/2 rounded bg-muted/60 animate-pulse" />
                <div className="mt-3 flex items-center justify-between">
                  <div className="h-6 w-20 rounded-full bg-muted/60 animate-pulse" />
                  <div className="h-3 w-16 rounded bg-muted/60 animate-pulse" />
                </div>
                <div className="mt-3 flex gap-2">
                  <div className="h-5 w-12 rounded-full bg-muted/60 animate-pulse" />
                  <div className="h-5 w-16 rounded-full bg-muted/60 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
