export default function Loading() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-16">
        <div className="h-4 w-32 animate-pulse bg-cement-light" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[55fr_45fr] lg:gap-16">
          <div className="aspect-3/4 w-full animate-pulse bg-cement-light" />
          <div className="flex animate-pulse flex-col gap-6">
            <div className="h-12 w-3/4 bg-cement-light" />
            <div className="h-8 w-1/4 bg-cement-light" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-11 w-14 bg-cement-light" />
              ))}
            </div>
            <div className="h-14 w-full bg-cement-light" />
            <div className="flex flex-col gap-2">
              <div className="h-4 w-full bg-cement-light" />
              <div className="h-4 w-full bg-cement-light" />
              <div className="h-4 w-2/3 bg-cement-light" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
