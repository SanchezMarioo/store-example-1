'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HttpTypes } from '@medusajs/types'
import { useCart } from '@/lib/cart-context'
import { buttonPrimary, labelCaption, spinnerSquare } from '@/lib/ui'
import { getProductGallery } from '@/lib/product-image-overrides'

type Props = {
  product: HttpTypes.StoreProduct
}

const accordionSummary =
  'flex cursor-pointer list-none items-center justify-between py-4 text-sm font-bold uppercase tracking-wide text-ink [&::-webkit-details-marker]:hidden'

const buttonAdded =
  'flex items-center justify-center gap-3 border-2 border-ink bg-acid text-sm font-bold uppercase tracking-wide text-ink'

export default function ProductDetail({ product }: Props) {
  const { addItem, isLoading } = useCart()
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [added, setAdded] = useState(false)
  const [optionError, setOptionError] = useState(false)
  const optionsRef = useRef<HTMLDivElement>(null)
  const images = getProductGallery(product)

  const hasOptions = (product.options?.length ?? 0) > 0

  const selectedVariant = hasOptions
    ? product.variants?.find((v) =>
        v.options?.every((opt) => selectedOptions[opt.option_id ?? ''] === opt.value)
      )
    : product.variants?.[0]

  const allOptionsSelected =
    !hasOptions ||
    (product.options?.every((opt) => selectedOptions[opt.id] !== undefined) ?? false)

  const unavailable = allOptionsSelected && !selectedVariant

  const price = selectedVariant?.calculated_price?.calculated_amount

  const selectOption = (optionId: string, value: string) => {
    setOptionError(false)
    setSelectedOptions((prev) => ({ ...prev, [optionId]: value }))
  }

  const handleAddToCart = async () => {
    if (!allOptionsSelected) {
      setOptionError(true)
      optionsRef.current?.focus()
      return
    }
    if (!selectedVariant?.id) return
    await addItem(selectedVariant.id)
    setAdded(true)
    setTimeout(() => setAdded(false), 1000)
  }

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-16">
        <Link
          href="/productos"
          className="text-caption font-bold uppercase tracking-widest text-zinc-mid transition duration-150 hover:text-ink"
        >
          ← Volver al drop
        </Link>

        <div className="mt-8 grid gap-8 lg:grid-cols-[55fr_45fr] lg:gap-16">
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto lg:flex-col lg:overflow-visible">
            {images.length > 0 ? (
              images.map((image, index) => (
                <div
                  key={image.id}
                  className="relative aspect-3/4 w-10/12 shrink-0 snap-center bg-cement-light lg:w-full"
                >
                  <Image
                    src={image.url}
                    alt={`${product.title ?? 'Producto'} — imagen ${index + 1}`}
                    fill
                    sizes="(min-width: 1024px) 55vw, 85vw"
                    priority={index === 0}
                    className="object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="flex aspect-3/4 w-full items-center justify-center bg-cement-light text-caption font-bold uppercase tracking-widest text-zinc-mid">
                Sin imagen
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6 self-start lg:sticky lg:top-24">
            <h1 className="font-display text-h2 uppercase leading-[0.9] tracking-tight text-ink lg:text-5xl">
              {product.title}
            </h1>

            <p className="text-2xl font-bold tabular-nums text-ink">
              {price != null
                ? `$${price.toFixed(2)}`
                : allOptionsSelected
                  ? 'Consultar precio'
                  : 'Selecciona una opción'}
            </p>

            {hasOptions && (
              <div ref={optionsRef} tabIndex={-1} className="flex flex-col gap-6 focus:outline-none">
                {product.options?.map((option) => (
                  <div key={option.id} className="flex flex-col gap-3">
                    <p className={labelCaption}>{option.title}</p>
                    <div className="flex flex-wrap gap-2">
                      {option.values?.map((val) => {
                        const isSelected = selectedOptions[option.id] === val.value
                        return (
                          <button
                            key={val.id}
                            type="button"
                            onClick={() => selectOption(option.id, val.value)}
                            className={`flex h-11 min-w-11 items-center justify-center border-2 border-ink px-3 text-sm font-bold uppercase transition duration-150 active:scale-[0.98] ${
                              isSelected
                                ? 'bg-ink text-bone'
                                : 'bg-transparent text-ink hover:bg-ink hover:text-bone'
                            }`}
                          >
                            {val.value}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
                {optionError && (
                  <p role="alert" className="text-sm font-bold text-error">
                    Selecciona una opción para continuar.
                  </p>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isLoading || unavailable}
              className={`${added ? buttonAdded : buttonPrimary} h-14 w-full`}
            >
              {isLoading && <span aria-hidden className={spinnerSquare} />}
              {isLoading
                ? 'Añadiendo'
                : added
                  ? 'Añadido ✓'
                  : unavailable
                    ? 'No disponible'
                    : 'Añadir al carrito'}
            </button>

            <div className="border-b-2 border-ink">
              {product.description && (
                <details className="border-t-2 border-ink">
                  <summary className={accordionSummary}>
                    Descripción
                    <span aria-hidden>+</span>
                  </summary>
                  <p className="pb-4 text-base leading-relaxed text-zinc-mid">
                    {product.description}
                  </p>
                </details>
              )}
              <details className="border-t-2 border-ink">
                <summary className={accordionSummary}>
                  Envío y devoluciones
                  <span aria-hidden>+</span>
                </summary>
                <p className="pb-4 text-base leading-relaxed text-zinc-mid">
                  Envío a península en 24/48h laborables. Devoluciones gratuitas durante 30 días
                  desde la entrega.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
