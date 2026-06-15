export default function Loading() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="flex items-end justify-between border-b-2 border-ink pb-6">
          <div className="h-10 w-48 animate-pulse bg-cement-light" />
          <div className="h-4 w-24 animate-pulse bg-cement-light" />
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex animate-pulse flex-col gap-3">
              <div className="aspect-3/4 w-full bg-cement-light" />
              <div className="h-4 w-3/4 bg-cement-light" />
              <div className="h-4 w-1/3 bg-cement-light" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
