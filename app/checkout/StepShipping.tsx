'use client'

import { useEffect, useState } from 'react'
import { HttpTypes } from '@medusajs/types'
import { sdk } from '@/lib/medusa'
import { listAddresses } from '@/lib/address-actions'
import { alertError, buttonPrimary, inputBase, labelCaption, spinnerSquare } from '@/lib/ui'

type Props = {
  cart: HttpTypes.StoreCart
  onComplete: (updatedCart: HttpTypes.StoreCart) => void
}

type FormData = {
  email: string
  firstName: string
  lastName: string
  address1: string
  city: string
  postalCode: string
  countryCode: string
  phone: string
}

export default function StepShipping({ cart, onComplete }: Props) {
  const countries = (cart.region as (HttpTypes.StoreRegion & { countries?: { iso_2: string; display_name: string }[] }) | undefined)?.countries ?? []

  const [form, setForm] = useState<FormData>({
    email: cart.email ?? '',
    firstName: cart.shipping_address?.first_name ?? '',
    lastName: cart.shipping_address?.last_name ?? '',
    address1: cart.shipping_address?.address_1 ?? '',
    city: cart.shipping_address?.city ?? '',
    postalCode: cart.shipping_address?.postal_code ?? '',
    countryCode: cart.shipping_address?.country_code ?? (countries[0]?.iso_2 ?? 'es'),
    phone: cart.shipping_address?.phone ?? '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedAddresses, setSavedAddresses] = useState<HttpTypes.StoreCustomerAddress[]>([])

  useEffect(() => {
    listAddresses().then(setSavedAddresses).catch(() => {})
  }, [])

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const applySaved = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const addr = savedAddresses.find((a) => a.id === e.target.value)
    if (!addr) return
    setForm((prev) => ({
      ...prev,
      firstName: addr.first_name ?? '',
      lastName: addr.last_name ?? '',
      address1: addr.address_1 ?? '',
      city: addr.city ?? '',
      postalCode: addr.postal_code ?? '',
      countryCode: addr.country_code ?? prev.countryCode,
      phone: addr.phone ?? '',
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const { cart: updated } = await sdk.store.cart.update(cart.id, {
        email: form.email,
        shipping_address: {
          first_name: form.firstName,
          last_name: form.lastName,
          address_1: form.address1,
          city: form.city,
          postal_code: form.postalCode,
          country_code: form.countryCode,
          phone: form.phone || undefined,
        },
      })
      onComplete(updated)
    } catch {
      setError('Error al guardar la dirección. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <p role="alert" className={alertError}>
          {error}
        </p>
      )}

      {savedAddresses.length > 0 && (
        <div className="flex flex-col gap-2 border-2 border-ink bg-cement-light p-4">
          <label htmlFor="savedAddress" className={labelCaption}>
            Usar dirección guardada
          </label>
          <select
            id="savedAddress"
            defaultValue=""
            onChange={applySaved}
            disabled={isLoading}
            className={inputBase}
          >
            <option value="" disabled>
              Elige una dirección
            </option>
            {savedAddresses.map((a) => (
              <option key={a.id} value={a.id}>
                {a.first_name} {a.last_name} — {a.address_1}, {a.city}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className={labelCaption}>Email</label>
        <input
          id="email" name="email" type="email" required
          value={form.email} onChange={set('email')} disabled={isLoading}
          className={inputBase}
          autoComplete="email"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="firstName" className={labelCaption}>Nombre</label>
          <input
            id="firstName" name="firstName" type="text" required
            value={form.firstName} onChange={set('firstName')} disabled={isLoading}
            className={inputBase}
            autoComplete="given-name"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="lastName" className={labelCaption}>Apellidos</label>
          <input
            id="lastName" name="lastName" type="text" required
            value={form.lastName} onChange={set('lastName')} disabled={isLoading}
            className={inputBase}
            autoComplete="family-name"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="address1" className={labelCaption}>Dirección</label>
        <input
          id="address1" name="address1" type="text" required
          value={form.address1} onChange={set('address1')} disabled={isLoading}
          className={inputBase}
          autoComplete="address-line1"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="city" className={labelCaption}>Ciudad</label>
          <input
            id="city" name="city" type="text" required
            value={form.city} onChange={set('city')} disabled={isLoading}
            className={inputBase}
            autoComplete="address-level2"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="postalCode" className={labelCaption}>Código postal</label>
          <input
            id="postalCode" name="postalCode" type="text" required
            value={form.postalCode} onChange={set('postalCode')} disabled={isLoading}
            className={inputBase}
            autoComplete="postal-code"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="countryCode" className={labelCaption}>País</label>
          {countries.length > 0 ? (
            <select
              id="countryCode" name="countryCode"
              value={form.countryCode} onChange={set('countryCode')} disabled={isLoading}
              className={inputBase}
            >
              {countries.map((c) => (
                <option key={c.iso_2} value={c.iso_2}>
                  {c.display_name}
                </option>
              ))}
            </select>
          ) : (
            <input
              id="countryCode" name="countryCode" type="text" required
              value={form.countryCode} onChange={set('countryCode')} disabled={isLoading}
              className={inputBase}
              autoComplete="country"
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="phone" className={labelCaption}>Teléfono (opcional)</label>
          <input
            id="phone" name="phone" type="tel"
            value={form.phone} onChange={set('phone')} disabled={isLoading}
            className={inputBase}
            autoComplete="tel"
          />
        </div>
      </div>

      <button type="submit" disabled={isLoading} className={`${buttonPrimary} mt-2 h-12 w-full`}>
        {isLoading && <span aria-hidden className={spinnerSquare} />}
        {isLoading ? 'Guardando' : 'Continuar con el envío'}
      </button>
    </form>
  )
}
