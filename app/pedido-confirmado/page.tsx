'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { HttpTypes } from '@medusajs/types'

export default function PedidoConfirmadoPage() {
  const [order, setOrder] = useState<HttpTypes.StoreOrder | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('last_order')
    if (raw) {
      try {
        setOrder(JSON.parse(raw))
        sessionStorage.removeItem('last_order')
      } catch {
        // ignore
      }
    }
  }, [])

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full flex flex-col items-center gap-8 text-center">
        <div className="w-20 h-20 rounded-full bg-[#c2410c]/20 flex items-center justify-center">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c2410c"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-white font-black text-3xl sm:text-4xl uppercase tracking-tight">
            Pedido confirmado
          </h1>
          {order?.display_id && (
            <p className="text-zinc-400 text-sm">
              Pedido{' '}
              <span className="text-[#c2410c] font-black">#{order.display_id}</span>
            </p>
          )}
          <p className="text-zinc-500 text-sm mt-1">
            Te enviaremos un email con los detalles cuando tu pedido esté en camino.
          </p>
        </div>

        {order?.items && order.items.length > 0 && (
          <div className="w-full bg-zinc-900 rounded-2xl p-6 text-left flex flex-col gap-4">
            <h2 className="text-white font-black text-xs uppercase tracking-widest">
              Tu pedido
            </h2>
            <ul className="flex flex-col gap-3">
              {order.items.map((item) => (
                <li key={item.id} className="flex gap-3 items-center">
                  <div className="w-12 h-12 bg-zinc-800 rounded-lg overflow-hidden shrink-0">
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
                    <p className="text-white text-xs font-bold truncate leading-snug">
                      {item.product_title ?? item.title}
                    </p>
                    {item.variant_title && (
                      <p className="text-zinc-500 text-xs">{item.variant_title}</p>
                    )}
                    <p className="text-zinc-500 text-xs">×{item.quantity}</p>
                  </div>
                  <span className="text-[#c2410c] font-black text-sm shrink-0">
                    ${(item.unit_price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            {order.total != null && (
              <div className="border-t border-zinc-800 pt-3 flex justify-between items-center">
                <span className="text-white font-black uppercase tracking-wide text-xs">
                  Total
                </span>
                <span className="text-[#c2410c] font-black text-lg">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href="/pedidos"
            className="flex-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-black text-sm uppercase tracking-widest py-4 rounded-xl transition-colors text-center"
          >
            Ver mis pedidos
          </Link>
          <Link
            href="/productos"
            className="flex-1 bg-[#c2410c] hover:bg-[#9a3412] text-white font-black text-sm uppercase tracking-widest py-4 rounded-xl transition-colors text-center"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    </main>
  )
}
