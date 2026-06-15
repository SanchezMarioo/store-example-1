'use client'

import { useActionState } from 'react'
import { registerAction, AuthActionState } from '@/lib/auth-actions'
import { alertError, buttonPrimary, inputBase, labelCaption, spinnerSquare } from '@/lib/ui'

const initial: AuthActionState = { error: null, success: false }

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, initial)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && (
        <p role="alert" className={alertError}>
          {state.error}
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
            autoComplete="given-name"
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
            autoComplete="family-name"
            disabled={isPending}
            className={inputBase}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className={labelCaption}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          disabled={isPending}
          className={inputBase}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className={labelCaption}>
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          minLength={8}
          disabled={isPending}
          className={inputBase}
        />
        <p className="text-xs text-zinc-mid">Mínimo 8 caracteres.</p>
      </div>

      <button type="submit" disabled={isPending} className={`${buttonPrimary} mt-2 h-12 w-full`}>
        {isPending && <span aria-hidden className={spinnerSquare} />}
        {isPending ? 'Creando cuenta' : 'Crear cuenta'}
      </button>
    </form>
  )
}
