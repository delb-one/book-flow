export default function Loading() {
  return (
    <div className="mx-auto w-full space-y-8">
      <div className="h-8 w-32 rounded bg-muted/60 animate-pulse" />

      <div className="flex flex-col gap-6 rounded-3xl bg-muted/30 p-6 lg:flex-row lg:items-start lg:gap-8">
        <div className="size-28 shrink-0 rounded-full bg-muted/60 animate-pulse" />
        <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3 lg:max-w-xl">
            <div className="space-y-2">
              <div className="h-7 w-48 rounded bg-muted/60 animate-pulse" />
              <div className="h-4 w-80 max-w-full rounded bg-muted/60 animate-pulse" />
              <div className="h-4 w-64 max-w-full rounded bg-muted/60 animate-pulse" />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="h-4 w-40 rounded bg-muted/60 animate-pulse" />
              <div className="h-4 w-24 rounded bg-muted/60 animate-pulse" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-2 lg:min-w-50">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="h-24 rounded-xl border border-muted/60 bg-muted/20 animate-pulse"
              />
            ))}
            <div className="h-24 rounded-xl border border-muted/60 bg-muted/20 animate-pulse lg:col-span-2" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-5 w-48 rounded bg-muted/60 animate-pulse" />
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex shrink-0 flex-col gap-3 p-3">
              <div className="h-70 w-50 rounded-lg bg-muted/60 animate-pulse" />
              <div className="w-50 space-y-2">
                <div className="h-4 w-40 rounded bg-muted/60 animate-pulse" />
                <div className="h-3 w-28 rounded bg-muted/60 animate-pulse" />
                <div className="h-6 w-24 rounded-full bg-muted/60 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
