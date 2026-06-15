import Link from 'next/link'
import Image from 'next/image'
import { sdk } from '@/lib/medusa'
import { getDefaultRegionId } from '@/lib/region'
import { buttonPrimary } from '@/lib/ui'
import ProductCard from './productos/ProductCard'

const HERO_IMAGE = '/images/hero-drop.webp'

const BANNER_TEXT = 'SIN TEMPORADAS. SOLO DROPS. · '

const CATEGORIES = ['Hombre', 'Mujer', 'Accesorios']

const TRUST = [
  {
    title: 'Envío 24/48h',
    text: 'Pedidos a península en 24/48h laborables.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
        <path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
      </svg>
    ),
  },
  {
    title: 'Devoluciones 30 días',
    text: 'Si no te encaja, lo devuelves. Sin preguntas.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
      </svg>
    ),
  },
  {
    title: 'Algodón 240gsm',
    text: 'Tejido pesado que aguanta lavados y asfalto.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
      </svg>
    ),
  },
]

export default async function Home() {
  let products: Awaited<ReturnType<typeof sdk.store.product.list>>['products'] = []
  try {
    const regionId = await getDefaultRegionId()
    const result = await sdk.store.product.list({ limit: 4, region_id: regionId })
    products = result.products
  } catch {
    products = []
  }

  return (
    <main className="flex-1">
      <section className="border-b-2 border-ink">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 lg:grid-cols-5 lg:px-8 lg:py-24">
          <div className="flex flex-col items-start justify-center gap-8 lg:col-span-3">
            <h1 className="font-display text-h1 uppercase leading-[0.9] tracking-tight text-ink">
              Ropa que aguanta la calle.
            </h1>
            <p className="max-w-md text-lg text-zinc-mid">
              Sin temporadas. Solo drops. Algodón de 240gsm cosido en Europa y curtido en el
              asfalto.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/productos" className={`${buttonPrimary} h-12 px-8`}>
                Ver el drop
              </Link>
            </div>
          </div>
          <div className="relative hidden aspect-3/4 overflow-hidden lg:col-span-2 lg:flex">
            <Image
              src={HERO_IMAGE}
              alt="Drop 03"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/10 via-black/30 to-black/90" />
            <div className="relative z-10 flex w-full flex-col justify-between p-8">
              <p className="text-caption font-bold uppercase tracking-widest text-zinc-soft">
                Grieta — 2026
              </p>
              <div className="flex flex-col gap-6">
                <span className="h-2 w-24 bg-acid" />
                <p className="font-display text-5xl uppercase leading-[0.9] tracking-tight text-bone">
                  Drop 03
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b-2 border-ink">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
          <div className="grid gap-4 sm:grid-cols-3">
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                href="/productos"
                className="group flex aspect-3/4 items-end border-2 border-ink p-6 transition duration-150 hover:bg-acid"
              >
                <span className="font-display text-3xl uppercase tracking-tight text-ink">
                  {category}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b-2 border-ink">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-h2 uppercase tracking-tight text-ink">Drop actual</h2>
            <Link
              href="/productos"
              className="text-caption font-bold uppercase tracking-widest text-ink underline decoration-acid decoration-[3px] underline-offset-4 transition duration-150 hover:bg-acid"
            >
              Ver todo →
            </Link>
          </div>
          {products.length === 0 ? (
            <p className="mt-12 text-zinc-mid">El drop llega pronto. Vuelve en unos días.</p>
          ) : (
            <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="overflow-hidden whitespace-nowrap border-b-2 border-ink bg-acid py-4">
        <div className="flex w-max animate-marquee motion-reduce:animate-none">
          <span className="shrink-0 font-display text-3xl uppercase tracking-tight text-ink">
            {BANNER_TEXT.repeat(6)}
          </span>
          <span aria-hidden className="shrink-0 font-display text-3xl uppercase tracking-tight text-ink">
            {BANNER_TEXT.repeat(6)}
          </span>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:grid-cols-3 lg:px-8 lg:py-24">
          {TRUST.map((item) => (
            <div key={item.title} className="flex flex-col gap-4">
              <span className="text-ink">{item.icon}</span>
              <p className="text-caption font-bold uppercase tracking-widest text-ink">
                {item.title}
              </p>
              <p className="text-sm text-zinc-mid">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
