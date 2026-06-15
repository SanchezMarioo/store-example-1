'use client'

import Image from 'next/image'
import { HttpTypes } from '@medusajs/types'
import PromoForm from '../carrito/PromoForm'

type Props = {
  cart: HttpTypes.StoreCart | null
  onCartUpdate?: (cart: HttpTypes.StoreCart) => void
  promoFields?: string
}

function SummaryRows({ cart }: { cart: HttpTypes.StoreCart }) {
  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-3">
        {cart.items?.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
            <div className="relative aspect-3/4 w-12 shrink-0 overflow-hidden bg-cement">
              {item.thumbnail && (
                <Image
                  src={item.thumbnail}
                  alt={item.product_title ?? item.title}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-ink">
                {item.product_title ?? item.title}
              </p>
              {item.variant_title && (
                <p className="text-xs text-zinc-mid">{item.variant_title}</p>
              )}
              <p className="text-xs tabular-nums text-zinc-mid">×{item.quantity}</p>
            </div>
            <span className="shrink-0 text-sm font-bold tabular-nums text-ink">
              ${(item.unit_price * item.quantity).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2 border-t-2 border-ink pt-4">
        <div className="flex justify-between text-sm text-zinc-mid">
          <span>Subtotal</span>
          <span className="tabular-nums">${(cart.subtotal ?? 0).toFixed(2)}</span>
        </div>

        {(cart.shipping_total ?? 0) > 0 && (
          <div className="flex justify-between text-sm text-zinc-mid">
            <span>Envío</span>
            <span className="tabular-nums">${(cart.shipping_total ?? 0).toFixed(2)}</span>
          </div>
        )}

        {(cart.discount_total ?? 0) > 0 && (
          <div className="flex justify-between text-sm font-bold text-success">
            <span>Descuento</span>
            <span className="tabular-nums">−${(cart.discount_total ?? 0).toFixed(2)}</span>
          </div>
        )}

        {(cart.tax_total ?? 0) > 0 && (
          <div className="flex justify-between text-sm text-zinc-mid">
            <span>IVA</span>
            <span className="tabular-nums">${(cart.tax_total ?? 0).toFixed(2)}</span>
          </div>
        )}

        <div className="mt-1 flex items-center justify-between border-t-2 border-ink pt-3">
          <span className="text-sm font-bold uppercase tracking-wide text-ink">Total</span>
          <span className="text-xl font-bold tabular-nums text-ink">
            ${(cart.total ?? 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function OrderSummary({ cart, onCartUpdate, promoFields }: Props) {
  if (!cart) {
    return (
      <aside className="shrink-0 lg:w-96">
        <div className="h-64 animate-pulse border-2 border-ink bg-cement-light lg:sticky lg:top-24" />
      </aside>
    )
  }

  return (
    <aside className="shrink-0 lg:w-96">
      <details className="border-2 border-ink bg-cement-light lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-caption font-bold uppercase tracking-widest text-ink [&::-webkit-details-marker]:hidden">
          Resumen del pedido
          <span className="text-base font-bold tabular-nums">
            ${(cart.total ?? 0).toFixed(2)}
          </span>
        </summary>
        <div className="flex flex-col gap-4 border-t-2 border-ink p-4">
          <SummaryRows cart={cart} />
          {onCartUpdate && (
            <PromoForm cart={cart} onUpdate={onCartUpdate} fields={promoFields} />
          )}
        </div>
      </details>

      <div className="hidden flex-col gap-4 border-2 border-ink bg-cement-light p-6 lg:sticky lg:top-24 lg:flex">
        <h2 className="text-caption font-bold uppercase tracking-widest text-ink">
          Resumen del pedido
        </h2>
        <SummaryRows cart={cart} />
        {onCartUpdate && <PromoForm cart={cart} onUpdate={onCartUpdate} />}
      </div>
    </aside>
  )
}
