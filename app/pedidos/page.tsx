import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getTokenCookie } from '@/lib/cookies'
import { sdk } from '@/lib/medusa'
import { buttonPrimary } from '@/lib/ui'
import { orderBadge } from '@/lib/order-status'
import AccountNav from '@/components/AccountNav'

export default async function PedidosPage() {
  const token = await getTokenCookie()
  if (!token) redirect('/login')

  let orders: Awaited<ReturnType<typeof sdk.store.order.list>>['orders'] = []
  try {
    const result = await sdk.store.order.list(undefined, {
      Authorization: `Bearer ${token}`,
    })
    orders = result.orders
  } catch {
    redirect('/login')
  }

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <h1 className="font-display text-h2 uppercase tracking-tight text-ink">Mis pedidos</h1>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row">
          <AccountNav />

          <div className="max-w-2xl flex-1">
            {orders.length === 0 ? (
              <div className="flex max-w-md flex-col items-start gap-6 border-2 border-ink bg-cement-light p-8">
                <p className="text-lg text-ink">Aún no tienes pedidos.</p>
                <Link href="/productos" className={`${buttonPrimary} h-12 px-8`}>
                  Ver el drop
                </Link>
              </div>
            ) : (
              <ul className="flex flex-col gap-6">
                {orders.map((order) => {
                  const badge = orderBadge(order)
                  return (
                    <li key={order.id}>
                      <Link
                        href={`/pedidos/${order.id}`}
                        className="flex flex-col gap-4 border-2 border-ink bg-cement-light p-6 transition duration-150 hover:bg-acid"
                      >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="flex items-center gap-3">
                          <span className="text-sm font-bold uppercase tracking-wide text-ink">
                            Pedido #{order.display_id}
                          </span>
                          <span
                            className={`border-2 px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest ${badge.classes}`}
                          >
                            {badge.label}
                          </span>
                        </span>
                        <span className="text-caption font-bold uppercase tracking-widest text-zinc-mid">
                          {new Date(order.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1">
                        {order.items?.map((item) => (
                          <span key={item.id} className="text-sm text-zinc-mid">
                            {item.product_title ?? item.title}
                            {item.variant_title ? ` (${item.variant_title})` : ''} ×{item.quantity}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between border-t-2 border-ink pt-4">
                        <span className="text-caption font-bold uppercase tracking-widest text-zinc-mid">
                          Total
                        </span>
                        <span className="font-bold tabular-nums text-ink">
                          ${(order.total ?? 0).toFixed(2)}
                        </span>
                      </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
