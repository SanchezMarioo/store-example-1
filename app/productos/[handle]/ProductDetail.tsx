'use client'

import { useState } from "react"
import Link from "next/link"
import { HttpTypes } from "@medusajs/types"

type Props = {
  product: HttpTypes.StoreProduct
}

export default function ProductDetail({ product }: Props) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

  const hasOptions = (product.options?.length ?? 0) > 0

  const selectedVariant = hasOptions
    ? product.variants?.find((variant) =>
        variant.options?.every(
          (optVal) => selectedOptions[optVal.option_id ?? ""] === optVal.value
        )
      )
    : product.variants?.[0]

  const price = selectedVariant?.calculated_price?.calculated_amount

  const allOptionsSelected =
    !hasOptions ||
    (product.options?.every((opt) => selectedOptions[opt.id] !== undefined) ?? false)

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-12 sm:px-8 lg:px-16">
      <Link
        href="/productos"
        className="text-zinc-500 text-sm hover:text-white transition-colors mb-8 inline-block"
      >
        ← Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-4">
        <div className="aspect-square bg-zinc-900 rounded-xl overflow-hidden">
          {product.thumbnail ? (
            <img
              src={product.thumbnail}
              alt={product.title ?? "Producto"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-zinc-600">Sin imagen</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <h1 className="text-white font-black text-3xl sm:text-4xl uppercase tracking-tight leading-none">
            {product.title}
          </h1>

          <p className="text-[#c2410c] font-black text-2xl">
            {price != null
              ? `$${price.toFixed(2)}`
              : allOptionsSelected
                ? "Consultar precio"
                : "Selecciona una opción"}
          </p>

          {product.description && (
            <p className="text-zinc-400 text-base leading-relaxed">
              {product.description}
            </p>
          )}

          {product.options?.map((option) => (
            <div key={option.id}>
              <p className="text-zinc-400 text-xs uppercase tracking-widest mb-3">
                {option.title}
              </p>
              <div className="flex flex-wrap gap-2">
                {option.values?.map((val) => {
                  const isSelected = selectedOptions[option.id] === val.value
                  return (
                    <button
                      key={val.id}
                      onClick={() =>
                        setSelectedOptions((prev) => ({
                          ...prev,
                          [option.id]: val.value,
                        }))
                      }
                      className={`px-4 py-2 rounded-lg border text-sm font-bold transition-colors ${
                        isSelected
                          ? "border-[#c2410c] bg-[#c2410c] text-white"
                          : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"
                      }`}
                    >
                      {val.value}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          <button
            className="mt-auto w-full bg-[#c2410c] hover:bg-[#9a3412] text-white font-black text-sm uppercase tracking-widest py-4 rounded-xl transition-colors"
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </main>
  )
}
