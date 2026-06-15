import { notFound } from 'next/navigation'
import { getCollectionByHandle, listProducts } from '@/lib/catalog'
import ProductCard from '@/app/productos/ProductCard'

export default async function ColeccionPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params

  const collection = await getCollectionByHandle(handle)
  if (!collection) notFound()

  const products = await listProducts({ collectionId: collection.id })

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

        {products.length === 0 ? (
          <p className="mt-16 text-zinc-mid">No hay productos en esta colección por ahora.</p>
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
