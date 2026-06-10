import { redirect } from 'next/navigation'
import { getTokenCookie } from '@/lib/cookies'
import { sdk } from '@/lib/medusa'
import Link from 'next/link'

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
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-12 sm:px-8 lg:px-16">
      <h1 className="text-white font-black text-3xl sm:text-4xl uppercase tracking-tight mb-10">
        Mis pedidos
      </h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-6 mt-24">
          <p className="text-zinc-500 text-lg">Aún no tienes pedidos.</p>
          <Link
            href="/productos"
            className="bg-[#c2410c] hover:bg-[#9a3412] text-white font-black text-sm uppercase tracking-widest px-8 py-4 rounded-xl transition-colors"
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-4 max-w-2xl">
          {orders.map((order) => (
            <li
              key={order.id}
              className="bg-zinc-900 rounded-xl p-6 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-black text-sm uppercase tracking-wide">
                  Pedido #{order.display_id}
                </span>
                <span className="text-zinc-500 text-xs">
                  {new Date(order.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {order.items?.map((item) => (
                  <span key={item.id} className="text-zinc-400 text-sm">
                    {item.product_title ?? item.title}
                    {item.variant_title ? ` (${item.variant_title})` : ''} ×{item.quantity}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center border-t border-zinc-800 pt-3">
                <span className="text-zinc-500 text-xs uppercase tracking-widest">Total</span>
                <span className="text-[#c2410c] font-black">
                  ${(order.total ?? 0).toFixed(2)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
