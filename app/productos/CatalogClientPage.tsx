'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { HttpTypes } from '@medusajs/types'
import ProductCard from './ProductCard'
import CatalogToolbar from './CatalogToolbar'

type Props = {
  products: HttpTypes.StoreProduct[]
}

function sortProducts(products: HttpTypes.StoreProduct[], orden: string) {
  const arr = [...products]
  if (orden === 'precio-asc') {
    arr.sort((a, b) => {
      const pa = a.variants?.[0]?.calculated_price?.calculated_amount ?? Infinity
      const pb = b.variants?.[0]?.calculated_price?.calculated_amount ?? Infinity
      return pa - pb
    })
  } else if (orden === 'precio-desc') {
    arr.sort((a, b) => {
      const pa = a.variants?.[0]?.calculated_price?.calculated_amount ?? -Infinity
      const pb = b.variants?.[0]?.calculated_price?.calculated_amount ?? -Infinity
      return pb - pa
    })
  }
  return arr
}

export default function CatalogClientPage({ products }: Props) {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const orden = searchParams.get('orden') ?? 'novedad'

  const filtered = useMemo(() => {
    let result = products
    if (q.trim()) {
      const lower = q.toLowerCase()
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(lower) ||
          p.handle?.toLowerCase().includes(lower)
      )
    }
    return sortProducts(result, orden)
  }, [products, q, orden])

  return (
    <>
      <div className="mt-8">
        <CatalogToolbar />
      </div>
      {filtered.length === 0 ? (
        <p className="mt-16 text-zinc-mid">
          {q
            ? 'No hay productos que coincidan con tu búsqueda.'
            : 'No hay productos disponibles. El drop llega pronto.'}
        </p>
      ) : (
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  )
}
