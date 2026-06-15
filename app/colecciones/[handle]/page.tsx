import { notFound } from 'next/navigation'
import { getCollectionByHandle, listProducts, ProductSort } from '@/lib/catalog'
import ProductCard from '@/app/productos/ProductCard'
import CatalogToolbar from '@/app/productos/CatalogToolbar'

type SearchParams = {
  q?: string
  orden?: string
}

export default async function ColeccionPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>
  searchParams: Promise<SearchParams>
}) {
  const { handle } = await params
  const { q, orden } = await searchParams

  const collection = await getCollectionByHandle(handle)
  if (!collection) notFound()

  const products = await listProducts({
    q,
    collectionId: collection.id,
    sort: (orden as ProductSort) || undefined,
  })

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-6">
          <h1 className="font-display text-h2 uppercase tracking-tight text-ink">
            {collection.title}
          </h1>
          <p className="text-caption font-bold uppercase tracking-widest text-zinc-mid">
            {products.length} artículos
          </p>
        </div>

        <div className="mt-8">
          <CatalogToolbar />
        </div>

        {products.length === 0 ? (
          <p className="mt-16 text-zinc-mid">
            No hay productos en esta colección por ahora.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
