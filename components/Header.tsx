'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-context'
import { logoutAction } from '@/lib/auth-actions'

type Props = {
  isAuthenticated: boolean
}

export default function Header({ isAuthenticated }: Props) {
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a] border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 h-16 flex items-center justify-between">
        <Link
          href="/productos"
          className="text-white font-black text-lg uppercase tracking-widest hover:text-[#c2410c] transition-colors"
        >
          Forja Urbana
        </Link>

        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/cuenta"
                className="text-zinc-400 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors"
              >
                Mi cuenta
              </Link>
              <Link
                href="/pedidos"
                className="text-zinc-400 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors"
              >
                Pedidos
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="text-zinc-500 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors"
                >
                  Salir
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="text-zinc-400 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors"
            >
              Iniciar sesión
            </Link>
          )}

          <Link href="/carrito" className="relative p-2 text-zinc-400 hover:text-white transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>

            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#c2410c] text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center leading-none">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}
