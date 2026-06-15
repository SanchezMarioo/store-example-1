'use client'

import Image from 'next/image'
import Link from 'next/link'
import { HttpTypes } from '@medusajs/types'

type Props = {
  product: HttpTypes.StoreProduct
}

export default function ProductCard({ product }: Props) {
  const price = product.variants?.[0]?.calculated_price?.calculated_amount

  return (
    <Link
      href={`/productos/${product.handle}`}
      className="group flex flex-col transition duration-150 active:scale-[0.98]"
    >
      <div className="relative aspect-3/4 w-full overflow-hidden bg-cement-light">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title ?? 'Producto'}
            fill
            sizes="(min-width: 1024px) 25vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-caption font-bold uppercase tracking-widest text-zinc-mid">
            Sin imagen
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 pt-3">
        <h2 className="text-base font-medium text-ink">
          <span className="decoration-acid decoration-[3px] underline-offset-4 group-hover:underline">
            {product.title}
          </span>
        </h2>
        {price != null && (
          <p className="font-bold tabular-nums text-ink">${price.toFixed(2)}</p>
        )}
      </div>
    </Link>
  )
}
