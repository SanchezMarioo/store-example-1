export default function Loading() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-12 sm:px-8 lg:px-16">
      <div className="h-10 w-40 bg-zinc-800 rounded mb-10 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-zinc-900 rounded-xl overflow-hidden animate-pulse">
            <div className="aspect-square bg-zinc-800" />
            <div className="p-4 flex flex-col gap-3">
              <div className="h-4 bg-zinc-800 rounded w-3/4" />
              <div className="h-5 bg-zinc-800 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
