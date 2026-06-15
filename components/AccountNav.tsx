'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/lib/auth-actions'

const ITEMS = [
  { href: '/cuenta', label: 'Mis datos' },
  { href: '/cuenta/direcciones', label: 'Direcciones' },
  { href: '/pedidos', label: 'Mis pedidos' },
]

export default function AccountNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Cuenta"
      className="flex shrink-0 gap-6 overflow-x-auto border-b-2 border-ink pb-4 lg:w-56 lg:flex-col lg:gap-4 lg:border-b-0 lg:border-r-2 lg:pb-0 lg:pr-8"
    >
      {ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`whitespace-nowrap text-caption font-bold uppercase tracking-widest transition duration-150 ${
            pathname === item.href
              ? 'text-ink underline decoration-acid decoration-[3px] underline-offset-8'
              : 'text-zinc-mid hover:text-ink'
          }`}
        >
          {item.label}
        </Link>
      ))}
      <form action={logoutAction} className="lg:mt-12">
        <button
          type="submit"
          className="whitespace-nowrap text-caption font-bold uppercase tracking-widest text-zinc-mid transition duration-150 hover:text-error"
        >
          Cerrar sesión
        </button>
      </form>
    </nav>
  )
}
