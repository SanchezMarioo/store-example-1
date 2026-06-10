'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'

export default function CarritoPage() {
  const { cart, itemCount, isLoading, updateItem, removeItem } = useCart()

  const isEmpty = !cart || (cart.items?.length ?? 0) === 0

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-12 sm:px-8 lg:px-16">
      <h1 className="text-white font-black text-3xl sm:text-4xl uppercase tracking-tight mb-10">
        Carrito{itemCount > 0 && <span className="text-[#c2410c] ml-2">({itemCount})</span>}
      </h1>

      {isEmpty ? (
        <div className="flex flex-col items-center gap-6 mt-24">
          <p className="text-zinc-500 text-lg">Tu carrito está vacío.</p>
          <Link
            href="/productos"
            className="bg-[#c2410c] hover:bg-[#9a3412] text-white font-black text-sm uppercase tracking-widest px-8 py-4 rounded-xl transition-colors"
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <ul className="flex-1 flex flex-col gap-4">
            {cart.items?.map((item) => (
              <li
                key={item.id}
                className="bg-zinc-900 rounded-xl p-4 flex gap-4 items-center"
              >
                <div className="w-20 h-20 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
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
                  <p className="text-white font-bold text-sm leading-snug truncate">
                    {item.product_title ?? item.title}
                  </p>
                  {item.variant_title && (
                    <p className="text-zinc-500 text-xs mt-0.5">{item.variant_title}</p>
                  )}
                  <p className="text-[#c2410c] font-black text-sm mt-1">
                    ${item.unit_price.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() =>
                      item.quantity > 1
                        ? updateItem(item.id, item.quantity - 1)
                        : removeItem(item.id)
                    }
                    disabled={isLoading}
                    className="w-8 h-8 rounded-lg border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white transition-colors flex items-center justify-center text-lg font-bold disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="text-white font-bold w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateItem(item.id, item.quantity + 1)}
                    disabled={isLoading}
                    className="w-8 h-8 rounded-lg border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white transition-colors flex items-center justify-center text-lg font-bold disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  disabled={isLoading}
                  className="text-zinc-600 hover:text-red-500 transition-colors ml-2 shrink-0 disabled:opacity-40"
                  aria-label="Eliminar"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>

          <aside className="lg:w-80 shrink-0">
            <div className="bg-zinc-900 rounded-xl p-6 flex flex-col gap-4 sticky top-24">
              <h2 className="text-white font-black text-lg uppercase tracking-wide">
                Resumen
              </h2>

              <div className="flex justify-between text-zinc-400 text-sm">
                <span>Subtotal</span>
                <span>${(cart.subtotal ?? 0).toFixed(2)}</span>
              </div>

              {(cart.discount_total ?? 0) > 0 && (
                <div className="flex justify-between text-green-500 text-sm">
                  <span>Descuento</span>
                  <span>−${cart.discount_total!.toFixed(2)}</span>
                </div>
              )}

              <div className="border-t border-zinc-800 pt-4 flex justify-between">
                <span className="text-white font-black uppercase tracking-wide">Total</span>
                <span className="text-[#c2410c] font-black text-xl">
                  ${(cart.total ?? 0).toFixed(2)}
                </span>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-[#c2410c] hover:bg-[#9a3412] text-white font-black text-sm uppercase tracking-widest py-4 rounded-xl transition-colors mt-2 text-center block"
              >
                Finalizar compra →
              </Link>
            </div>
          </aside>
        </div>
      )}
    </main>
  )
}
