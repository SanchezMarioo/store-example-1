'use client'

import { useActionState, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { HttpTypes } from '@medusajs/types'
import {
  AddressActionState,
  deleteAddress,
  saveAddress,
  setDefaultAddress,
} from '@/lib/address-actions'
import {
  alertError,
  buttonPrimary,
  buttonSecondary,
  inputBase,
  labelCaption,
  spinnerSquare,
} from '@/lib/ui'

type Country = { iso_2: string; display_name: string }

type Props = {
  addresses: HttpTypes.StoreCustomerAddress[]
  countries: Country[]
}

const initialState: AddressActionState = { error: null, success: false }

export default function AddressManager({ addresses, countries }: Props) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(saveAddress, initialState)
  const [editing, setEditing] = useState<HttpTypes.StoreCustomerAddress | 'new' | null>(null)
  const [isMutating, startMutation] = useTransition()
  const [sawSuccess, setSawSuccess] = useState(state.success)

  if (state.success !== sawSuccess) {
    setSawSuccess(state.success)
    if (state.success) setEditing(null)
  }

  const current = editing === 'new' ? null : editing

  const remove = (id: string) => {
    startMutation(async () => {
      await deleteAddress(id)
      router.refresh()
    })
  }

  const makeDefault = (id: string) => {
    startMutation(async () => {
      await setDefaultAddress(id)
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-8">
      {editing === null && (
        <>
          {addresses.length === 0 ? (
            <p className="text-zinc-mid">Aún no tienes direcciones guardadas.</p>
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {addresses.map((addr) => (
                <li
                  key={addr.id}
                  className="flex flex-col gap-3 border-2 border-ink bg-cement-light p-6"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-ink">
                      {addr.first_name} {addr.last_name}
                    </span>
                    {addr.is_default_shipping && (
                      <span className="border-2 border-ink bg-acid px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-ink">
                        Por defecto
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5 text-sm text-zinc-mid">
                    <span>{addr.address_1}</span>
                    {addr.address_2 && <span>{addr.address_2}</span>}
                    <span>
                      {addr.postal_code} {addr.city}
                    </span>
                    <span className="uppercase">{addr.country_code}</span>
                    {addr.phone && <span>{addr.phone}</span>}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-4 border-t-2 border-ink pt-3">
                    <button
                      type="button"
                      onClick={() => setEditing(addr)}
                      className="text-caption font-bold uppercase tracking-widest text-zinc-mid transition duration-150 hover:text-ink"
                    >
                      Editar
                    </button>
                    {!addr.is_default_shipping && (
                      <button
                        type="button"
                        onClick={() => makeDefault(addr.id)}
                        disabled={isMutating}
                        className="text-caption font-bold uppercase tracking-widest text-zinc-mid transition duration-150 hover:text-ink disabled:opacity-40"
                      >
                        Hacer predet.
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => remove(addr.id)}
                      disabled={isMutating}
                      className="text-caption font-bold uppercase tracking-widest text-zinc-mid transition duration-150 hover:text-error disabled:opacity-40"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            onClick={() => setEditing('new')}
            className={`${buttonPrimary} h-12 self-start px-8`}
          >
            Añadir dirección
          </button>
        </>
      )}

      {editing !== null && (
        <form action={formAction} className="flex max-w-lg flex-col gap-5">
          {current && <input type="hidden" name="id" value={current.id} />}

          {state.error && (
            <p role="alert" className={alertError}>
              {state.error}
            </p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="first_name" className={labelCaption}>Nombre</label>
              <input
                id="first_name" name="first_name" required
                defaultValue={current?.first_name ?? ''}
                className={inputBase} autoComplete="given-name"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="last_name" className={labelCaption}>Apellidos</label>
              <input
                id="last_name" name="last_name"
                defaultValue={current?.last_name ?? ''}
                className={inputBase} autoComplete="family-name"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="address_1" className={labelCaption}>Dirección</label>
            <input
              id="address_1" name="address_1" required
              defaultValue={current?.address_1 ?? ''}
              className={inputBase} autoComplete="address-line1"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="address_2" className={labelCaption}>
              Piso, puerta (opcional)
            </label>
            <input
              id="address_2" name="address_2"
              defaultValue={current?.address_2 ?? ''}
              className={inputBase} autoComplete="address-line2"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="city" className={labelCaption}>Ciudad</label>
              <input
                id="city" name="city" required
                defaultValue={current?.city ?? ''}
                className={inputBase} autoComplete="address-level2"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="postal_code" className={labelCaption}>Código postal</label>
              <input
                id="postal_code" name="postal_code" required
                defaultValue={current?.postal_code ?? ''}
                className={inputBase} autoComplete="postal-code"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="province" className={labelCaption}>Provincia (opcional)</label>
              <input
                id="province" name="province"
                defaultValue={current?.province ?? ''}
                className={inputBase} autoComplete="address-level1"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="country_code" className={labelCaption}>País</label>
              {countries.length > 0 ? (
                <select
                  id="country_code" name="country_code"
                  defaultValue={current?.country_code ?? countries[0]?.iso_2}
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
                  id="country_code" name="country_code" required
                  defaultValue={current?.country_code ?? 'es'}
                  className={inputBase} autoComplete="country"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className={labelCaption}>Teléfono (opcional)</label>
            <input
              id="phone" name="phone" type="tel"
              defaultValue={current?.phone ?? ''}
              className={inputBase} autoComplete="tel"
            />
          </div>

          <label className="flex items-center gap-3 text-sm text-ink">
            <input
              type="checkbox" name="is_default_shipping"
              defaultChecked={current?.is_default_shipping ?? false}
              className="h-4 w-4 accent-acid"
            />
            Usar como dirección por defecto
          </label>

          <div className="mt-2 flex gap-3">
            <button type="submit" disabled={isPending} className={`${buttonPrimary} h-12 flex-1`}>
              {isPending && <span aria-hidden className={spinnerSquare} />}
              {isPending ? 'Guardando' : 'Guardar dirección'}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className={`${buttonSecondary} h-12 px-6`}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
