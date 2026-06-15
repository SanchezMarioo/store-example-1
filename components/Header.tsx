'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HttpTypes } from '@medusajs/types'

type Props = {
  categories?: HttpTypes.StoreProductCategory[]
}

const BAR_TEXT = 'ENVÍO 24/48H · DEVOLUCIONES 30 DÍAS · SIN TEMPORADAS. SOLO DROPS. · '

const navLink =
  'text-caption font-bold uppercase tracking-widest text-ink transition duration-150 hover:bg-acid'

const mobileLink =
  'font-display text-5xl uppercase tracking-tight text-bone transition duration-150 hover:text-acid'

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

export default function Header({ categories = [] }: Props) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const linkClass = (href: string) =>
    `${navLink} ${pathname === href ? 'underline decoration-acid decoration-[3px] underline-offset-8' : ''}`

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
          <Link
            href="/"
            className="font-display text-2xl uppercase tracking-tight text-ink transition duration-150 hover:bg-acid"
          >
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
            </div>

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
        <div className="fixed inset-0 z-60 flex flex-col bg-ink lg:hidden">
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
          </nav>
        </div>
      )}
    </>
  )
}
