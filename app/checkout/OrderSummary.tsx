'use client'

import { HttpTypes } from '@medusajs/types'

type Props = {
  cart: HttpTypes.StoreCart | null
}

export default function OrderSummary({ cart }: Props) {
  if (!cart) {
    return (
      <aside className="lg:w-96 shrink-0">
        <div className="bg-zinc-900/50 rounded-2xl p-6 sticky top-24 animate-pulse h-64" />
      </aside>
    )
  }

  return (
    <aside className="lg:w-96 shrink-0">
      <div className="bg-zinc-900 rounded-2xl p-6 sticky top-24 flex flex-col gap-4">
        <h2 className="text-white font-black text-sm uppercase tracking-widest">
          Resumen del pedido
        </h2>

        <ul className="flex flex-col gap-3">
          {cart.items?.map((item) => (
            <li key={item.id} className="flex gap-3 items-center">
              <div className="w-14 h-14 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.product_title ?? item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-bold leading-snug truncate">
                  {item.product_title ?? item.title}
                </p>
                {item.variant_title && (
                  <p className="text-zinc-500 text-xs">{item.variant_title}</p>
                )}
                <p className="text-zinc-400 text-xs">×{item.quantity}</p>
              </div>
              <span className="text-[#c2410c] font-black text-sm shrink-0">
                ${(item.unit_price * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>

        <div className="border-t border-zinc-800 pt-4 flex flex-col gap-2">
          <div className="flex justify-between text-zinc-400 text-sm">
            <span>Subtotal</span>
            <span>${(cart.subtotal ?? 0).toFixed(2)}</span>
          </div>

          {(cart.shipping_total ?? 0) > 0 && (
            <div className="flex justify-between text-zinc-400 text-sm">
              <span>Envío</span>
              <span>${(cart.shipping_total ?? 0).toFixed(2)}</span>
            </div>
          )}

          {(cart.discount_total ?? 0) > 0 && (
            <div className="flex justify-between text-green-500 text-sm">
              <span>Descuento</span>
              <span>−${(cart.discount_total ?? 0).toFixed(2)}</span>
            </div>
          )}

          {(cart.tax_total ?? 0) > 0 && (
            <div className="flex justify-between text-zinc-400 text-sm">
              <span>IVA</span>
              <span>${(cart.tax_total ?? 0).toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between items-center border-t border-zinc-800 pt-3 mt-1">
            <span className="text-white font-black uppercase tracking-wide text-sm">Total</span>
            <span className="text-[#c2410c] font-black text-xl">
              ${(cart.total ?? 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
