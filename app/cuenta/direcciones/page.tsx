import { redirect } from 'next/navigation'
import { getTokenCookie } from '@/lib/cookies'
import { sdk } from '@/lib/medusa'
import { listAddresses } from '@/lib/address-actions'
import AccountNav from '@/components/AccountNav'
import AddressManager from './AddressManager'

type Country = { iso_2: string; display_name: string }

async function getCountries(): Promise<Country[]> {
  try {
    const { regions } = await sdk.store.region.list({
      fields: 'id,countries.iso_2,countries.display_name',
    })
    return regions.flatMap((r) => (r.countries ?? []) as Country[])
  } catch {
    return []
  }
}

export default async function DireccionesPage() {
  const token = await getTokenCookie()
  if (!token) redirect('/login')

  const [addresses, countries] = await Promise.all([
    listAddresses(),
    getCountries(),
  ])

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <h1 className="font-display text-h2 uppercase tracking-tight text-ink">
          Direcciones
        </h1>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row">
          <AccountNav />
          <div className="flex-1">
            <AddressManager addresses={addresses} countries={countries} />
          </div>
        </div>
      </div>
    </main>
  )
}
