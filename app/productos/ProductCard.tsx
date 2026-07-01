'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { HttpTypes } from '@medusajs/types'
import { useCart } from '@/lib/cart-context'
import { getProductThumbnail } from '@/lib/product-image-overrides'

type Props = {
  product: HttpTypes.StoreProduct
}

type Chip = { variantId: string; label: string; available: boolean }

function isAvailable(v: HttpTypes.StoreProductVariant): boolean {
  return !v.manage_inventory || v.allow_backorder || (v.inventory_quantity ?? 1) > 0
}

function resolveChips(product: HttpTypes.StoreProduct): Chip[] {
  if (!product.variants?.length) return []

  const sizeOption = product.options?.find(
    (o) => o.title?.toLowerCase() === 'size' || o.title?.toLowerCase() === 'talla'
  )

  const byLabel = new Map<string, HttpTypes.StoreProductVariant[]>()

  for (const v of product.variants) {
    if (!v.id) continue
    const raw = sizeOption
      ? (v.options?.find((o) => o.option_id === sizeOption.id)?.value ?? v.title ?? 'ÚNICA')
      : (v.title ?? 'ÚNICA')
    const label = raw.toUpperCase()
    if (!byLabel.has(label)) byLabel.set(label, [])
    byLabel.get(label)!.push(v)
  }

  return Array.from(byLabel.entries()).map(([label, variants]) => {
    const available = variants.some(isAvailable)
    const variantId = (variants.find(isAvailable) ?? variants[0]).id!
    return { variantId, label, available }
  })
}

export default function ProductCard({ product }: Props) {
  const { addItem, isLoading } = useCart()
  const [addedId, setAddedId] = useState<string | null>(null)
  const thumbnail = getProductThumbnail(product)

  const chips = resolveChips(product)

  const price = product.variants?.[0]?.calculated_price?.calculated_amount

  async function handleAdd(e: React.MouseEvent, variantId: string) {
    e.preventDefault()
    e.stopPropagation()
    try {
      await addItem(variantId)
      setAddedId(variantId)
      setTimeout(() => setAddedId(null), 1200)
    } catch (err) {
      console.error('[ProductCard] addItem failed:', err)
    }
  }

  return (
    <Link
      href={`/productos/${product.handle}`}
      className="group flex flex-col transition duration-150 active:scale-[0.98]"
    >
      <div className="relative aspect-3/4 w-full overflow-hidden bg-cement-light">
        {thumbnail ? (
          <Image
            src={thumbnail}
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

        {chips.length > 0 && (
          <div
            className="absolute inset-x-0 bottom-0 translate-y-full bg-ink p-3 transition-transform duration-200 ease-out group-hover:translate-y-0"
            onClick={(e) => e.stopPropagation()}
          >
            {chips.length === 1 ? (
              <button
                type="button"
                onClick={(e) => handleAdd(e, chips[0].variantId)}
                disabled={isLoading || !chips[0].available}
                className="w-full border-2 border-bone py-2.5 text-[11px] font-bold uppercase tracking-widest text-bone transition duration-150 hover:border-acid hover:bg-acid hover:text-ink disabled:opacity-40"
              >
                {addedId ? 'AÑADIDO ✓' : 'AÑADIR'}
              </button>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {chips.map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    onClick={(e) => handleAdd(e, chip.variantId)}
                    disabled={!chip.available || isLoading}
                    className={[
                      'flex h-8 min-w-8 items-center justify-center border-2 px-2 text-[11px] font-bold uppercase tracking-wide transition duration-150',
                      chip.available
                        ? 'border-bone text-bone hover:border-acid hover:bg-acid hover:text-ink'
                        : 'pointer-events-none border-bone/30 text-bone/30 line-through',
                      addedId === chip.variantId ? 'border-acid bg-acid text-ink' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            )}
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
