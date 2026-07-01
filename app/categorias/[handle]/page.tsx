import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getCategoryByHandle, listProducts, ProductSort } from '@/lib/catalog'
import { getCategoryThumbnail } from '@/lib/category-image-overrides'
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
  const thumbnail = getCategoryThumbnail(category)

  const products = await listProducts({
    q,
    categoryId: category.id,
    sort: (orden as ProductSort) || undefined,
  })

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        <section className="overflow-hidden border-2 border-ink bg-cement-light">
          <div className="grid lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch">
            <div className="flex min-h-[320px] flex-col justify-between gap-8 p-6 lg:min-h-[420px] lg:p-8">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-10 bg-acid" />
                  <p className="text-caption font-bold uppercase tracking-widest text-zinc-mid">
                    Categoria activa
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <h1 className="font-display text-h2 uppercase tracking-tight text-ink">
                      {category.name}
                    </h1>
                    <p className="text-caption font-bold uppercase tracking-widest text-zinc-mid tabular-nums">
                      {products.length} artículos
                    </p>
                  </div>

                  {category.description && (
                    <p className="max-w-xl text-base leading-7 text-zinc-mid">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="border-2 border-ink bg-cement px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-mid">
                    Disponibles
                  </p>
                  <p className="mt-2 font-display text-3xl uppercase tracking-tight text-ink tabular-nums">
                    {products.length}
                  </p>
                </div>

                <div className="border-2 border-ink bg-ink px-4 py-3 text-bone">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-soft">
                    Estado
                  </p>
                  <p className="mt-2 font-display text-2xl uppercase tracking-tight text-bone">
                    Drop activo
                  </p>
                </div>

                <Link
                  href="/productos"
                  className="flex items-center justify-center border-2 border-ink bg-acid px-4 py-3 text-caption font-bold uppercase tracking-widest text-ink transition duration-150 hover:bg-ink hover:text-bone"
                >
                  Ver catálogo
                </Link>
              </div>
            </div>

            <div className="relative min-h-[320px] border-t-2 border-ink lg:min-h-[420px] lg:border-l-2 lg:border-t-0">
              {thumbnail ? (
                <Image
                  src={thumbnail}
                  alt={category.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-linear-to-br from-cement-light via-cement to-zinc-300" />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 lg:p-8">
                <span className="inline-flex border-2 border-bone px-3 py-1 text-caption font-bold uppercase tracking-widest text-bone">
                  Colección activa
                </span>
                <span className="hidden border-2 border-bone/70 px-3 py-1 text-caption font-bold uppercase tracking-widest text-bone/80 lg:inline-flex">
                  Mira el detalle
                </span>
              </div>
            </div>
          </div>
        </section>

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
