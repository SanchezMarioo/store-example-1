'use client'

import { useActionState, useState } from 'react'
import { loginAction, AuthActionState } from '@/lib/auth-actions'
import { alertError, buttonPrimary, inputBase, labelCaption, spinnerSquare } from '@/lib/ui'

const initial: AuthActionState = { error: null, success: false }

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initial)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && (
        <p role="alert" className={alertError}>
          {state.error}
        </p>
      )}

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
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="current-password"
            disabled={isPending}
            className={`${inputBase} pr-20`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute inset-y-0 right-0 px-4 text-caption font-bold uppercase tracking-widest text-zinc-mid transition duration-150 hover:text-ink"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? 'Ocultar' : 'Ver'}
          </button>
        </div>
      </div>

      <button type="submit" disabled={isPending} className={`${buttonPrimary} mt-2 h-12 w-full`}>
        {isPending && <span aria-hidden className={spinnerSquare} />}
        {isPending ? 'Entrando' : 'Iniciar sesión'}
      </button>
    </form>
  )
}
