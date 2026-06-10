'use client'

import { useActionState } from 'react'
import { HttpTypes } from '@medusajs/types'
import { updateCustomerAction, CustomerActionState } from '@/lib/customer-actions'

type Props = {
  customer: HttpTypes.StoreCustomer
}

const initial: CustomerActionState = { error: null, success: false }

export default function CuentaForm({ customer }: Props) {
  const [state, formAction, isPending] = useActionState(updateCustomerAction, initial)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && (
        <p role="alert" className="text-red-400 text-sm bg-red-950/30 border border-red-900 rounded-lg px-4 py-3">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="text-green-400 text-sm bg-green-950/30 border border-green-900 rounded-lg px-4 py-3">
          Datos actualizados correctamente
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="firstName" className="text-zinc-400 text-xs uppercase tracking-widest">
            Nombre
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            defaultValue={customer.first_name ?? ''}
            disabled={isPending}
            className="bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-600 disabled:opacity-50 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="lastName" className="text-zinc-400 text-xs uppercase tracking-widest">
            Apellido
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            defaultValue={customer.last_name ?? ''}
            disabled={isPending}
            className="bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-600 disabled:opacity-50 transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-zinc-400 text-xs uppercase tracking-widest">
          Email
        </label>
        <div className="bg-zinc-900/50 border border-zinc-800 text-zinc-500 rounded-xl px-4 py-3 text-sm">
          {customer.email}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full bg-[#c2410c] hover:bg-[#9a3412] disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-black text-sm uppercase tracking-widest py-4 rounded-xl transition-colors"
      >
        {isPending ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </form>
  )
}
