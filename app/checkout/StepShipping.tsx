'use client'

import { useState } from 'react'
import { HttpTypes } from '@medusajs/types'
import { sdk } from '@/lib/medusa'

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

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

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

  const inputClass =
    'bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-600 disabled:opacity-50 transition-colors w-full'
  const labelClass = 'text-zinc-400 text-xs uppercase tracking-widest mb-1 block'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <p className="text-red-400 text-sm bg-red-950/30 border border-red-900 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className={labelClass}>Email</label>
        <input
          id="email" name="email" type="email" required
          value={form.email} onChange={set('email')} disabled={isLoading}
          className={inputClass} placeholder="tu@email.com"
          autoComplete="email"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="firstName" className={labelClass}>Nombre</label>
          <input
            id="firstName" name="firstName" type="text" required
            value={form.firstName} onChange={set('firstName')} disabled={isLoading}
            className={inputClass} placeholder="Carlos"
            autoComplete="given-name"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="lastName" className={labelClass}>Apellido</label>
          <input
            id="lastName" name="lastName" type="text" required
            value={form.lastName} onChange={set('lastName')} disabled={isLoading}
            className={inputClass} placeholder="García"
            autoComplete="family-name"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="address1" className={labelClass}>Dirección</label>
        <input
          id="address1" name="address1" type="text" required
          value={form.address1} onChange={set('address1')} disabled={isLoading}
          className={inputClass} placeholder="Calle Mayor 24, 3ºB"
          autoComplete="address-line1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="city" className={labelClass}>Ciudad</label>
          <input
            id="city" name="city" type="text" required
            value={form.city} onChange={set('city')} disabled={isLoading}
            className={inputClass} placeholder="Madrid"
            autoComplete="address-level2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="postalCode" className={labelClass}>Código postal</label>
          <input
            id="postalCode" name="postalCode" type="text" required
            value={form.postalCode} onChange={set('postalCode')} disabled={isLoading}
            className={inputClass} placeholder="28001"
            autoComplete="postal-code"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="countryCode" className={labelClass}>País</label>
          {countries.length > 0 ? (
            <select
              id="countryCode" name="countryCode"
              value={form.countryCode} onChange={set('countryCode')} disabled={isLoading}
              className={inputClass}
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
              className={inputClass} placeholder="es"
              autoComplete="country"
            />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className={labelClass}>Teléfono (opcional)</label>
          <input
            id="phone" name="phone" type="tel"
            value={form.phone} onChange={set('phone')} disabled={isLoading}
            className={inputClass} placeholder="+34 600 000 000"
            autoComplete="tel"
          />
        </div>
      </div>

      <button
        type="submit" disabled={isLoading}
        className="w-full bg-[#c2410c] hover:bg-[#9a3412] disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-black text-sm uppercase tracking-widest py-4 rounded-xl transition-colors mt-2"
      >
        {isLoading ? 'Guardando...' : 'Continuar con el envío →'}
      </button>
    </form>
  )
}
