import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { HttpTypes } from '@medusajs/types'
import { getTokenCookie } from '@/lib/cookies'
import { sdk } from '@/lib/medusa'
import { orderBadge } from '@/lib/order-status'
import AccountNav from '@/components/AccountNav'

const ORDER_FIELDS =
  '*items,*items.variant,*shipping_address,*shipping_methods,+display_id,+status,+fulfillment_status,+created_at,+email,+currency_code,+subtotal,+shipping_total,+discount_total,+tax_total,+total'

export default async function PedidoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const token = await getTokenCookie()
  if (!token) redirect('/login')

  let order: HttpTypes.StoreOrder
  try {
    const result = await sdk.store.order.retrieve(
      id,
      { fields: ORDER_FIELDS },
      { Authorization: `Bearer ${token}` }
    )
    order = result.order
  } catch {
    redirect('/pedidos')
  }

  const badge = orderBadge(order)
  const address = order.shipping_address
  const shippingMethod = order.shipping_methods?.[0]

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <Link
          href="/pedidos"
          className="text-caption font-bold uppercase tracking-widest text-zinc-mid transition duration-150 hover:text-ink"
        >
          ← Mis pedidos
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-h2 uppercase tracking-tight text-ink">
            Pedido #{order.display_id}
          </h1>
          <span
            className={`border-2 px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest ${badge.classes}`}
          >
            {badge.label}
          </span>
        </div>
        <p className="mt-2 text-caption font-bold uppercase tracking-widest text-zinc-mid">
          {new Date(order.created_at).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row">
          <AccountNav />

          <div className="flex flex-1 flex-col gap-8 lg:flex-row lg:items-start">
            <div className="flex-1">
              <ul className="border-t-2 border-ink">
                {order.items?.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-4 border-b-2 border-ink py-5"
                  >
                    <div className="relative aspect-3/4 w-16 shrink-0 overflow-hidden bg-cement-light">
                      {item.thumbnail && (
                        <Image
                          src={item.thumbnail}
                          alt={item.product_title ?? item.title}
                          fill
                          sizes="64px"
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
                      <p className="mt-2 text-sm tabular-nums text-zinc-mid">
                        ×{item.quantity}
                      </p>
                    </div>
                    <span className="shrink-0 font-bold tabular-nums text-ink">
                      ${((item.unit_price ?? 0) * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="flex shrink-0 flex-col gap-6 lg:w-80">
              {address && (
                <div className="border-2 border-ink bg-cement-light p-6">
                  <h2 className="text-caption font-bold uppercase tracking-widest text-zinc-mid">
                    Dirección de envío
                  </h2>
                  <div className="mt-3 flex flex-col gap-0.5 text-sm text-ink">
                    <span className="font-bold">
                      {address.first_name} {address.last_name}
                    </span>
                    <span>{address.address_1}</span>
                    {address.address_2 && <span>{address.address_2}</span>}
                    <span>
                      {address.postal_code} {address.city}
                    </span>
                    {address.province && <span>{address.province}</span>}
                    <span className="uppercase">{address.country_code}</span>
                    {address.phone && <span className="mt-1">{address.phone}</span>}
                  </div>
                </div>
              )}

              {shippingMethod && (
                <div className="border-2 border-ink bg-cement-light p-6">
                  <h2 className="text-caption font-bold uppercase tracking-widest text-zinc-mid">
                    Envío
                  </h2>
                  <p className="mt-3 text-sm text-ink">{shippingMethod.name}</p>
                </div>
              )}

              <div className="border-2 border-ink bg-cement-light p-6">
                <h2 className="text-caption font-bold uppercase tracking-widest text-zinc-mid">
                  Resumen
                </h2>
                <div className="mt-3 flex flex-col gap-2">
                  <div className="flex justify-between text-sm text-zinc-mid">
                    <span>Subtotal</span>
                    <span className="tabular-nums">
                      ${(order.subtotal ?? 0).toFixed(2)}
                    </span>
                  </div>
                  {(order.shipping_total ?? 0) > 0 && (
                    <div className="flex justify-between text-sm text-zinc-mid">
                      <span>Envío</span>
                      <span className="tabular-nums">
                        ${(order.shipping_total ?? 0).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {(order.discount_total ?? 0) > 0 && (
                    <div className="flex justify-between text-sm font-bold text-success">
                      <span>Descuento</span>
                      <span className="tabular-nums">
                        −${(order.discount_total ?? 0).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {(order.tax_total ?? 0) > 0 && (
                    <div className="flex justify-between text-sm text-zinc-mid">
                      <span>IVA</span>
                      <span className="tabular-nums">
                        ${(order.tax_total ?? 0).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="mt-1 flex items-center justify-between border-t-2 border-ink pt-3">
                    <span className="text-sm font-bold uppercase tracking-wide text-ink">
                      Total
                    </span>
                    <span className="text-xl font-bold tabular-nums text-ink">
                      ${(order.total ?? 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  )
}
