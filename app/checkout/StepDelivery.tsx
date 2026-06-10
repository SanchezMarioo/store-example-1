'use client'

import { useState } from 'react'
import { HttpTypes } from '@medusajs/types'
import { sdk } from '@/lib/medusa'

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
      <div className="flex flex-col gap-4">
        <p className="text-zinc-500 text-sm">
          No hay métodos de envío disponibles para esta dirección.
          Verifica que la dirección sea correcta o contacta con soporte.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <p className="text-red-400 text-sm bg-red-950/30 border border-red-900 rounded-xl px-4 py-3">
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
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                isSelected
                  ? 'border-[#c2410c] bg-[#c2410c]/10'
                  : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="shippingOption"
                  value={option.id}
                  checked={isSelected}
                  onChange={() => setSelected(option.id)}
                  disabled={isLoading}
                  className="accent-[#c2410c]"
                />
                <span className="text-white font-bold text-sm">{option.name}</span>
              </div>
              <span className="text-[#c2410c] font-black text-sm">
                {price === 0 ? 'Gratis' : `$${price.toFixed(2)}`}
              </span>
            </label>
          )
        })}
      </div>

      <button
        type="submit" disabled={isLoading || !selected}
        className="w-full bg-[#c2410c] hover:bg-[#9a3412] disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-black text-sm uppercase tracking-widest py-4 rounded-xl transition-colors mt-2"
      >
        {isLoading ? 'Procesando...' : 'Continuar al pago →'}
      </button>
    </form>
  )
}
