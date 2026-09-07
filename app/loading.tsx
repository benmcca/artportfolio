export default function Loading() {
  return (
    <main
      className="min-h-screen bg-background px-6 py-4 text-foreground lg:py-10"
      aria-busy="true"
      aria-label="Loading gallery"
    >
      <div className="mx-auto w-full min-w-0 max-w-[1100px]">
        <div
          className="mb-8 h-10 w-52 animate-pulse rounded bg-surface"
          aria-hidden="true"
        />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-6">
          {Array.from({ length: 9 }, (_, index) => (
            <div
              key={index}
              className="aspect-square animate-pulse rounded bg-surface"
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
