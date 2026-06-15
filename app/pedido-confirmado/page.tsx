'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HttpTypes } from '@medusajs/types'
import { buttonPrimary, buttonSecondary } from '@/lib/ui'

export default function PedidoConfirmadoPage() {
  const [order, setOrder] = useState<HttpTypes.StoreOrder | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('last_order')
    if (raw) {
      try {
        setOrder(JSON.parse(raw))
        sessionStorage.removeItem('last_order')
      } catch {
        setOrder(null)
      }
    }
  }, [])

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <div className="flex w-full max-w-lg flex-col items-center gap-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center border-2 border-success text-success">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="font-display text-h2 uppercase tracking-tight text-ink">
            Pedido confirmado
          </h1>
          {order?.display_id && (
            <p className="text-sm text-zinc-mid">
              Pedido <span className="font-bold tabular-nums text-ink">#{order.display_id}</span>
            </p>
          )}
          <p className="text-sm text-zinc-mid">
            Te enviaremos un email con los detalles cuando tu pedido esté en camino.
          </p>
        </div>

        {order?.items && order.items.length > 0 && (
          <div className="flex w-full flex-col gap-4 border-2 border-ink bg-cement-light p-6 text-left">
            <h2 className="text-caption font-bold uppercase tracking-widest text-ink">
              Tu pedido
            </h2>
            <ul className="flex flex-col gap-3">
              {order.items.map((item) => (
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

            {order.total != null && (
              <div className="flex items-center justify-between border-t-2 border-ink pt-3">
                <span className="text-caption font-bold uppercase tracking-widest text-ink">
                  Total
                </span>
                <span className="text-lg font-bold tabular-nums text-ink">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <Link href="/pedidos" className={`${buttonSecondary} h-12 flex-1`}>
            Ver mis pedidos
          </Link>
          <Link href="/productos" className={`${buttonPrimary} h-12 flex-1`}>
            Seguir comprando
          </Link>
        </div>
      </div>
    </main>
  )
}
