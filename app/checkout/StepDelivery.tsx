'use client'

import { useState } from 'react'
import { HttpTypes } from '@medusajs/types'
import { sdk } from '@/lib/medusa'
import { alertError, buttonPrimary, spinnerSquare } from '@/lib/ui'

type ShippingOption = HttpTypes.StoreCartShippingOptionWithServiceZone

type Props = {
  cart: HttpTypes.StoreCart
  shippingOptions: ShippingOption[]
  onComplete: (updatedCart: HttpTypes.StoreCart) => void
}

export default function StepDelivery({ cart, shippingOptions, onComplete }: Props) {
  const [selected, setSelected] = useState<string>(
    (cart.shipping_methods?.[0] as { shipping_option_id?: string } | undefined)?.shipping_option_id ?? ''
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected) return
    setIsLoading(true)
    setError(null)
    try {
      const { cart: updated } = await sdk.store.cart.addShippingMethod(cart.id, {
        option_id: selected,
      })
      onComplete(updated)
    } catch {
      setError('Error al seleccionar el método de envío.')
    } finally {
      setIsLoading(false)
    }
  }

  if (shippingOptions.length === 0) {
    return (
      <p className="text-sm text-zinc-mid">
        No hay métodos de envío disponibles para esta dirección. Verifica que la dirección sea
        correcta o contacta con soporte.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p role="alert" className={alertError}>
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {shippingOptions.map((option) => {
          const price = option.calculated_price?.calculated_amount ?? option.amount ?? 0
          const isSelected = selected === option.id
          return (
            <label
              key={option.id}
              className={`flex cursor-pointer items-center justify-between border-2 border-ink p-4 transition duration-150 ${
                isSelected ? 'bg-ink text-bone' : 'bg-transparent text-ink hover:bg-ink hover:text-bone'
              }`}
            >
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  name="shippingOption"
                  value={option.id}
                  checked={isSelected}
                  onChange={() => setSelected(option.id)}
                  disabled={isLoading}
                  className="accent-acid"
                />
                <span className="text-sm font-bold uppercase tracking-wide">{option.name}</span>
              </span>
              <span className="text-sm font-bold tabular-nums">
                {price === 0 ? 'Gratis' : `$${price.toFixed(2)}`}
              </span>
            </label>
          )
        })}
      </div>

      <button
        type="submit"
        disabled={isLoading || !selected}
        className={`${buttonPrimary} mt-2 h-12 w-full`}
      >
        {isLoading && <span aria-hidden className={spinnerSquare} />}
        {isLoading ? 'Procesando' : 'Continuar al pago'}
      </button>
    </form>
  )
}
