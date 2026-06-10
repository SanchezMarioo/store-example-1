import { redirect } from 'next/navigation'
import { getTokenCookie } from '@/lib/cookies'
import { sdk } from '@/lib/medusa'
import CuentaForm from './CuentaForm'

export default async function CuentaPage() {
  const token = await getTokenCookie()
  if (!token) redirect('/login')

  let customer
  try {
    const result = await sdk.store.customer.retrieve(undefined, {
      Authorization: `Bearer ${token}`,
    })
    customer = result.customer
  } catch {
    redirect('/login')
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-12 sm:px-8 lg:px-16">
      <div className="max-w-lg">
        <h1 className="text-white font-black text-3xl sm:text-4xl uppercase tracking-tight mb-2">
          Mi cuenta
        </h1>
        <p className="text-zinc-500 text-sm mb-10">{customer.email}</p>
        <CuentaForm customer={customer} />
      </div>
    </main>
  )
}
