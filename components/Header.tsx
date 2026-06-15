'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HttpTypes } from '@medusajs/types'
import { useCart } from '@/lib/cart-context'
import { logoutAction } from '@/lib/auth-actions'

type Props = {
  isAuthenticated: boolean
  categories?: HttpTypes.StoreProductCategory[]
}

const BAR_TEXT = 'ENVÍO 24/48H · DEVOLUCIONES 30 DÍAS · SIN TEMPORADAS. SOLO DROPS. · '

const navLink =
  'text-caption font-bold uppercase tracking-widest text-ink transition duration-150 hover:bg-acid'

const mobileLink = 'font-display text-5xl uppercase tracking-tight text-bone transition duration-150 hover:text-acid'

function BagIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function CartBadge({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center bg-acid px-1 text-[10px] font-bold leading-none text-ink">
      {count > 99 ? '99+' : count}
    </span>
  )
}

export default function Header({ isAuthenticated, categories = [] }: Props) {
  const { itemCount } = useCart()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const linkClass = (href: string) =>
    `${navLink} ${pathname === href ? 'underline decoration-acid decoration-[3px] underline-offset-8' : ''}`

  if (pathname === '/checkout') {
    return (
      <header className="sticky top-0 z-50 border-b-2 border-ink bg-cement/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link href="/" className="font-display text-2xl uppercase tracking-tight text-ink">
            Grieta
          </Link>
          <span className="flex items-center gap-2 text-caption font-bold uppercase tracking-widest text-zinc-mid">
            <LockIcon />
            Pago seguro
          </span>
        </div>
      </header>
    )
  }

  return (
    <>
      <div className="overflow-hidden whitespace-nowrap bg-ink py-2 text-bone">
        <div className="flex w-max animate-marquee [animation-duration:24s] motion-reduce:animate-none">
          <span className="shrink-0 text-caption font-bold uppercase tracking-widest">
            {BAR_TEXT.repeat(4)}
          </span>
          <span aria-hidden className="shrink-0 text-caption font-bold uppercase tracking-widest">
            {BAR_TEXT.repeat(4)}
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b-2 border-ink bg-cement/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Link href="/" className="font-display text-2xl uppercase tracking-tight text-ink transition duration-150 hover:bg-acid">
            Grieta
          </Link>

          <nav className="flex items-center gap-6" aria-label="Principal">
            <div className="hidden items-center gap-6 lg:flex">
              <Link href="/productos" className={linkClass('/productos')}>
                Tienda
              </Link>
              {categories.length > 0 && (
                <div className="group relative">
                  <button
                    type="button"
                    className={`${navLink} flex items-center gap-1`}
                    aria-haspopup="true"
                  >
                    Categorías
                    <span aria-hidden className="text-[10px]">▾</span>
                  </button>
                  <div className="invisible absolute left-0 top-full z-50 flex min-w-48 flex-col border-2 border-ink bg-cement opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/categorias/${cat.handle}`}
                        className="border-b-2 border-ink px-4 py-3 text-caption font-bold uppercase tracking-widest text-ink transition duration-150 last:border-b-0 hover:bg-acid"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {isAuthenticated ? (
                <>
                  <Link href="/cuenta" className={linkClass('/cuenta')}>
                    Mi cuenta
                  </Link>
                  <Link href="/pedidos" className={linkClass('/pedidos')}>
                    Pedidos
                  </Link>
                  <form action={logoutAction}>
                    <button type="submit" className="text-caption font-bold uppercase tracking-widest text-zinc-mid transition duration-150 hover:text-ink">
                      Salir
                    </button>
                  </form>
                </>
              ) : (
                <Link href="/login" className={linkClass('/login')}>
                  Iniciar sesión
                </Link>
              )}
            </div>

            <Link
              href="/carrito"
              className="relative p-2 text-ink transition duration-150 hover:bg-acid"
              aria-label={`Carrito, ${itemCount} artículos`}
            >
              <BagIcon />
              <CartBadge count={itemCount} />
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
              className="p-2 text-ink lg:hidden"
            >
              <MenuIcon />
            </button>
          </nav>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-ink lg:hidden">
          <div className="flex h-16 items-center justify-between border-b-2 border-line-dark px-4">
            <span className="font-display text-2xl uppercase tracking-tight text-bone">Grieta</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
              className="p-2 text-bone transition duration-150 hover:text-acid"
            >
              <CloseIcon />
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-8 px-6" aria-label="Menú móvil">
            <Link href="/productos" onClick={() => setMenuOpen(false)} className={mobileLink}>
              Tienda
            </Link>
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categorias/${cat.handle}`}
                    onClick={() => setMenuOpen(false)}
                    className="text-caption font-bold uppercase tracking-widest text-zinc-soft transition duration-150 hover:text-acid"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
            <Link href="/carrito" onClick={() => setMenuOpen(false)} className={mobileLink}>
              Carrito{itemCount > 0 ? ` (${itemCount})` : ''}
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/cuenta" onClick={() => setMenuOpen(false)} className={mobileLink}>
                  Mi cuenta
                </Link>
                <Link href="/pedidos" onClick={() => setMenuOpen(false)} className={mobileLink}>
                  Pedidos
                </Link>
              </>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)} className={mobileLink}>
                Iniciar sesión
              </Link>
            )}
          </nav>
          {isAuthenticated && (
            <form action={logoutAction} className="border-t-2 border-line-dark px-6 py-6">
              <button type="submit" className="text-caption font-bold uppercase tracking-widest text-zinc-soft transition duration-150 hover:text-acid">
                Cerrar sesión
              </button>
            </form>
          )}
        </div>
      )}
    </>
  )
}
