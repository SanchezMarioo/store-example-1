import { notFound } from 'next/navigation'
import { getCategoryByHandle, listProducts, ProductSort } from '@/lib/catalog'
import ProductCard from '@/app/productos/ProductCard'
import CatalogToolbar from '@/app/productos/CatalogToolbar'

type SearchParams = {
  q?: string
  orden?: string
}

export default async function CategoriaPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>
  searchParams: Promise<SearchParams>
}) {
  const { handle } = await params
  const { q, orden } = await searchParams

  const category = await getCategoryByHandle(handle)
  if (!category) notFound()

  const products = await listProducts({
    q,
    categoryId: category.id,
    sort: (orden as ProductSort) || undefined,
  })

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-6">
          <h1 className="font-display text-h2 uppercase tracking-tight text-ink">
            {category.name}
          </h1>
          <p className="text-caption font-bold uppercase tracking-widest text-zinc-mid">
            {products.length} artículos
          </p>
        </div>

        {category.description && (
          <p className="mt-6 max-w-2xl text-zinc-mid">{category.description}</p>
        )}

        <div className="mt-8">
          <CatalogToolbar />
        </div>

        {products.length === 0 ? (
          <p className="mt-16 text-zinc-mid">
            No hay productos en esta categoría por ahora.
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
