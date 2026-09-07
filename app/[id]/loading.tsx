export default function Loading() {
  return (
    <main
      className="min-h-screen bg-background px-6 py-4 text-foreground lg:py-10"
      aria-busy="true"
      aria-label="Loading artwork"
    >
      <div className="mx-auto w-full min-w-0 max-w-[1200px]">
        <div className="flex items-center justify-between">
          <div
            className="h-7 w-24 animate-pulse rounded bg-surface"
            aria-hidden="true"
          />
          <div
            className="h-7 w-16 animate-pulse rounded bg-surface"
            aria-hidden="true"
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-[60%_40%] lg:gap-0">
          <div
            className="aspect-square animate-pulse rounded bg-surface lg:mr-6 lg:min-h-[min(70vh,800px)] lg:aspect-auto"
            aria-hidden="true"
          />

          <div className="self-start lg:ml-6">
            <div
              className="h-10 w-3/4 animate-pulse rounded bg-surface"
              aria-hidden="true"
            />
            <div className="mt-8 space-y-3">
              <div
                className="h-4 w-full animate-pulse rounded bg-surface"
                aria-hidden="true"
              />
              <div
                className="h-4 w-11/12 animate-pulse rounded bg-surface"
                aria-hidden="true"
              />
              <div
                className="h-4 w-4/5 animate-pulse rounded bg-surface"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}