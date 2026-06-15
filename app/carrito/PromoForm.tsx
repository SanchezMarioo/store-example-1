'use client'

import { useState } from 'react'
import { HttpTypes } from '@medusajs/types'
import { sdk } from '@/lib/medusa'
import { useCart } from '@/lib/cart-context'
import { alertError, inputBase, spinnerSquare } from '@/lib/ui'

const PROMO_FIELDS =
  '+items,+items.thumbnail,+items.variant,+items.product,+promotions'

type Props = {
  cart?: HttpTypes.StoreCart | null
  onUpdate?: (cart: HttpTypes.StoreCart) => void
  fields?: string
}

export default function PromoForm({
  cart: controlledCart,
  onUpdate,
  fields = PROMO_FIELDS,
}: Props) {
  const ctx = useCart()
  const controlled = Boolean(onUpdate)
  const cart = controlled ? controlledCart : ctx.cart

  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const isLoading = controlled ? busy : ctx.isLoading
  const promos = (cart?.promotions ?? []).filter((p) => p.code)

  const apply = async (value: string) => {
    if (!controlled) {
      await ctx.applyPromo(value)
      return
    }
    if (!cart) return
    setBusy(true)
    try {
      const { cart: updated } = await sdk.store.cart.addPromotions(
        cart.id,
        { promo_codes: [value.trim()] },
        { fields }
      )
      onUpdate!(updated)
      const applied = updated.promotions?.some(
        (p) => p.code?.toLowerCase() === value.trim().toLowerCase()
      )
      if (!applied) throw new Error('Código no válido o expirado')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (value: string) => {
    if (!controlled) {
      await ctx.removePromo(value)
      return
    }
    if (!cart) return
    setBusy(true)
    try {
      const { cart: updated } = await sdk.store.cart.removePromotions(
        cart.id,
        { promo_codes: [value] },
        { fields }
      )
      onUpdate!(updated)
    } finally {
      setBusy(false)
    }
  }

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await apply(code)
      setCode('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo aplicar el código')
    }
  }

  return (
    <div className="flex flex-col gap-3 border-t-2 border-ink pt-4">
      <p className="text-caption font-bold uppercase tracking-widest text-zinc-mid">
        Código promocional
      </p>

      {promos.length > 0 && (
        <ul className="flex flex-col gap-2">
          {promos.map((promo) => (
            <li
              key={promo.id}
              className="flex items-center justify-between border-2 border-ink bg-bone px-3 py-2"
            >
              <span className="text-sm font-bold uppercase tracking-wide text-ink">
                {promo.code}
              </span>
              <button
                type="button"
                onClick={() => remove(promo.code!)}
                disabled={isLoading}
                aria-label={`Quitar ${promo.code}`}
                className="text-zinc-mid transition duration-150 hover:text-error disabled:pointer-events-none disabled:opacity-40"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className={alertError}>{error}</p>}

      <form onSubmit={handleApply} className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="GRIETA10"
          aria-label="Código promocional"
          className={`${inputBase} h-11 flex-1 uppercase`}
        />
        <button
          type="submit"
          disabled={isLoading || !code.trim()}
          className="flex h-11 shrink-0 items-center justify-center gap-2 border-2 border-ink bg-transparent px-5 text-sm font-bold uppercase tracking-wide text-ink transition duration-150 hover:bg-ink hover:text-bone disabled:pointer-events-none disabled:opacity-40"
        >
          {isLoading && <span aria-hidden className={spinnerSquare} />}
          Aplicar
        </button>
      </form>
    </div>
  )
}
