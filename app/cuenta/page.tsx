import { redirect } from 'next/navigation'
import { getTokenCookie } from '@/lib/cookies'
import { sdk } from '@/lib/medusa'
import AccountNav from '@/components/AccountNav'
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
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <h1 className="font-display text-h2 uppercase tracking-tight text-ink">Mi cuenta</h1>
        <p className="mt-2 text-sm text-zinc-mid">{customer.email}</p>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row">
          <AccountNav />
          <div className="max-w-lg flex-1">
            <CuentaForm customer={customer} />
          </div>
        </div>
      </div>
    </main>
  )
}
