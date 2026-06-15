'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { buttonPrimary } from '@/lib/ui'
import PromoForm from './PromoForm'

const FREE_SHIPPING_THRESHOLD = 80

const stepperButton =
  'flex h-11 w-11 items-center justify-center border-2 border-ink text-lg font-bold text-ink transition duration-150 hover:bg-ink hover:text-bone disabled:pointer-events-none disabled:opacity-40'

function progressWidth(subtotal: number): string {
  const ratio = subtotal / FREE_SHIPPING_THRESHOLD
  if (ratio >= 1) return 'w-full'
  if (ratio >= 0.75) return 'w-3/4'
  if (ratio >= 0.5) return 'w-1/2'
  if (ratio >= 0.25) return 'w-1/4'
  if (ratio > 0) return 'w-1/12'
  return 'w-0'
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

export default function CarritoPage() {
  const { cart, itemCount, isLoading, updateItem, removeItem } = useCart()

  const isEmpty = !cart || (cart.items?.length ?? 0) === 0
  const subtotal = cart?.subtotal ?? 0
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <h1 className="font-display text-h2 uppercase tracking-tight text-ink">
          Carrito
          {itemCount > 0 && <span className="ml-3 text-zinc-mid">({itemCount})</span>}
        </h1>

        {isEmpty ? (
          <div className="mt-12 flex max-w-md flex-col items-start gap-6 border-2 border-ink bg-cement-light p-8">
            <p className="text-lg text-ink">Tu carrito está vacío.</p>
            <Link href="/productos" className={`${buttonPrimary} h-12 px-8`}>
              Ver el drop
            </Link>
          </div>
        ) : (
          <div className="mt-10 flex flex-col gap-12 lg:flex-row">
            <ul className="flex-1 border-t-2 border-ink">
              {cart.items?.map((item) => (
                <li key={item.id} className="flex items-center gap-4 border-b-2 border-ink py-6">
                  <div className="relative aspect-3/4 w-20 shrink-0 overflow-hidden bg-cement-light">
                    {item.thumbnail && (
                      <Image
                        src={item.thumbnail}
                        alt={item.product_title ?? item.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">
                      {item.product_title ?? item.title}
                    </p>
                    {item.variant_title && (
                      <p className="mt-1 text-caption font-bold uppercase tracking-widest text-zinc-mid">
                        {item.variant_title}
                      </p>
                    )}
                    <p className="mt-2 font-bold tabular-nums text-ink">
                      ${item.unit_price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        item.quantity > 1
                          ? updateItem(item.id, item.quantity - 1)
                          : removeItem(item.id)
                      }
                      disabled={isLoading}
                      aria-label="Restar unidad"
                      className={stepperButton}
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-bold tabular-nums text-ink">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateItem(item.id, item.quantity + 1)}
                      disabled={isLoading}
                      aria-label="Sumar unidad"
                      className={stepperButton}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    disabled={isLoading}
                    aria-label="Eliminar artículo"
                    className="ml-2 shrink-0 p-2 text-zinc-mid transition duration-150 hover:text-error disabled:pointer-events-none disabled:opacity-40"
                  >
                    <TrashIcon />
                  </button>
                </li>
              ))}
            </ul>

            <aside className="shrink-0 lg:w-96">
              <div className="sticky top-24 flex flex-col gap-4 border-2 border-ink bg-cement-light p-6">
                <h2 className="text-h3 font-bold uppercase tracking-wide text-ink">Resumen</h2>

                <div className="flex justify-between text-sm text-zinc-mid">
                  <span>Subtotal</span>
                  <span className="tabular-nums">${subtotal.toFixed(2)}</span>
                </div>

                {(cart.discount_total ?? 0) > 0 && (
                  <div className="flex justify-between text-sm font-bold text-success">
                    <span>Descuento</span>
                    <span className="tabular-nums">−${cart.discount_total!.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <p className="text-caption font-bold uppercase tracking-widest text-zinc-mid">
                    {remaining > 0
                      ? `Te faltan $${remaining.toFixed(2)} para envío gratis`
                      : 'Envío gratis desbloqueado'}
                  </p>
                  <div className="h-2 w-full border border-ink bg-bone">
                    <div className={`h-full bg-acid ${progressWidth(subtotal)}`} />
                  </div>
                </div>

                <PromoForm />

                <div className="flex items-center justify-between border-t-2 border-ink pt-4">
                  <span className="font-bold uppercase tracking-wide text-ink">Total</span>
                  <span className="text-xl font-bold tabular-nums text-ink">
                    ${(cart.total ?? 0).toFixed(2)}
                  </span>
                </div>

                <Link href="/checkout" className={`${buttonPrimary} h-12 w-full`}>
                  Tramitar pedido
                </Link>
                <Link
                  href="/productos"
                  className="text-center text-caption font-bold uppercase tracking-widest text-zinc-mid transition duration-150 hover:text-ink"
                >
                  Seguir comprando
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
