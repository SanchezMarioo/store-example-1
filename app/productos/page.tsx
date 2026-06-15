import { listProducts } from '@/lib/catalog'
import CatalogClientPage from './CatalogClientPage'

export default async function ProductosPage() {
  const products = await listProducts({})

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-6">
          <h1 className="font-display text-h2 uppercase tracking-tight text-ink">El drop</h1>
          <p className="text-caption font-bold uppercase tracking-widest text-zinc-mid">
            {products.length} artículos
          </p>
        </div>
        <CatalogClientPage products={products} />
      </div>
    </main>
  )
}
