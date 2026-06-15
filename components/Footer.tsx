'use client'

import Link from 'next/link'

const footerLink = 'text-sm text-zinc-soft transition duration-150 hover:text-acid'
const columnTitle = 'text-caption font-bold uppercase tracking-widest text-zinc-soft'

export default function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-graphite text-bone">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:grid-cols-3 lg:px-8">
        <div className="flex flex-col gap-4">
          <p className={columnTitle}>Tienda</p>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/productos" className={footerLink}>
                El drop
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <p className={columnTitle}>Colecciones</p>
          <ul className="flex flex-col gap-2">
            <li>
              <Link href="/colecciones" className={footerLink}>
                Ver todas
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-4">
          <p className={columnTitle}>Grieta</p>
          <p className="max-w-xs text-sm text-zinc-soft">
            Ropa que aguanta la calle. Cosido en Europa, curtido en el asfalto.
          </p>
        </div>
      </div>
      <div className="border-t-2 border-line-dark">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <p className="py-4 text-caption font-bold uppercase tracking-widest text-zinc-soft">
            © 2026 Grieta
          </p>
          <p className="w-full text-center font-display text-[18vw] uppercase leading-[0.8] tracking-tight text-bone">
            Grieta
          </p>
        </div>
      </div>
    </footer>
  )
}
