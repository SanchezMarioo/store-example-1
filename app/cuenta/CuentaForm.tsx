'use client'

import { useActionState } from 'react'
import { HttpTypes } from '@medusajs/types'
import { updateCustomerAction, CustomerActionState } from '@/lib/customer-actions'
import { alertError, alertSuccess, buttonPrimary, inputBase, labelCaption, spinnerSquare } from '@/lib/ui'

type Props = {
  customer: HttpTypes.StoreCustomer
}

const initial: CustomerActionState = { error: null, success: false }

export default function CuentaForm({ customer }: Props) {
  const [state, formAction, isPending] = useActionState(updateCustomerAction, initial)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && (
        <p role="alert" className={alertError}>
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className={alertSuccess}>
          Datos actualizados correctamente.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="firstName" className={labelCaption}>
            Nombre
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            defaultValue={customer.first_name ?? ''}
            disabled={isPending}
            className={inputBase}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="lastName" className={labelCaption}>
            Apellidos
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            defaultValue={customer.last_name ?? ''}
            disabled={isPending}
            className={inputBase}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className={labelCaption}>Email</p>
        <div className="flex h-12 w-full items-center border-2 border-zinc-mid bg-cement px-4 text-base text-zinc-mid">
          {customer.email}
        </div>
        <p className="text-xs text-zinc-mid">El email no se puede cambiar.</p>
      </div>

      <button type="submit" disabled={isPending} className={`${buttonPrimary} mt-2 h-12 w-full`}>
        {isPending && <span aria-hidden className={spinnerSquare} />}
        {isPending ? 'Guardando' : 'Guardar cambios'}
      </button>
    </form>
  )
}
