'use client'

import { useActionState } from 'react'
import { loginAction, AuthActionState } from '@/lib/auth-actions'

const initial: AuthActionState = { error: null, success: false }

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initial)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && (
        <p role="alert" className="text-red-400 text-sm bg-red-950/30 border border-red-900 rounded-lg px-4 py-3">
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-zinc-400 text-xs uppercase tracking-widest">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          disabled={isPending}
          className="bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-600 disabled:opacity-50 transition-colors"
          placeholder="tu@email.com"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-zinc-400 text-xs uppercase tracking-widest">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          disabled={isPending}
          className="bg-zinc-900 border border-zinc-800 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-600 disabled:opacity-50 transition-colors"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full bg-[#c2410c] hover:bg-[#9a3412] disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-black text-sm uppercase tracking-widest py-4 rounded-xl transition-colors"
      >
        {isPending ? 'Entrando...' : 'Iniciar sesión'}
      </button>
    </form>
  )
}
