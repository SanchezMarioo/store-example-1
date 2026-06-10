export default function Loading() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-12 sm:px-8 lg:px-16">
      <div className="h-4 w-16 bg-zinc-800 rounded animate-pulse mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-4">
        <div className="aspect-square bg-zinc-900 rounded-xl animate-pulse" />
        <div className="flex flex-col gap-6">
          <div className="h-10 bg-zinc-800 rounded w-3/4 animate-pulse" />
          <div className="h-8 bg-zinc-800 rounded w-1/4 animate-pulse" />
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 bg-zinc-800 rounded w-2/3 animate-pulse" />
          </div>
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 w-14 bg-zinc-800 rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="h-14 bg-zinc-800 rounded-xl animate-pulse mt-4" />
        </div>
      </div>
    </main>
  )
}
