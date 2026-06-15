'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { HttpTypes } from '@medusajs/types'
import { inputBase } from '@/lib/ui'

type Props = {
  categories?: HttpTypes.StoreProductCategory[]
}

const SORTS = [
  { value: 'novedad', label: 'Novedad' },
  { value: 'precio-asc', label: 'Precio ↑' },
  { value: 'precio-desc', label: 'Precio ↓' },
]

const chipBase =
  'whitespace-nowrap border-2 border-ink px-3 py-1.5 text-caption font-bold uppercase tracking-widest transition duration-150'

export default function CatalogToolbar({ categories = [] }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentQ = searchParams.get('q') ?? ''
  const currentCat = searchParams.get('categoria') ?? ''
  const currentSort = searchParams.get('orden') ?? 'novedad'

  const [query, setQuery] = useState(currentQ)
  const firstRender = useRef(true)

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    const t = setTimeout(() => {
      if (query !== currentQ) setParam('q', query)
    }, 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar en el drop"
          aria-label="Buscar productos"
          className={`${inputBase} h-11 sm:max-w-xs`}
        />
        <div className="flex items-center gap-3">
          <label
            htmlFor="orden"
            className="text-caption font-bold uppercase tracking-widest text-zinc-mid"
          >
            Ordenar
          </label>
          <select
            id="orden"
            value={currentSort}
            onChange={(e) => setParam('orden', e.target.value)}
            className="h-11 border-2 border-ink bg-cement-light px-3 text-sm font-bold uppercase tracking-wide text-ink focus:outline-none focus:ring-2 focus:ring-acid focus:ring-offset-2 focus:ring-offset-cement"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setParam('categoria', '')}
            className={`${chipBase} ${
              currentCat === ''
                ? 'bg-ink text-bone'
                : 'bg-transparent text-ink hover:bg-acid'
            }`}
          >
            Todo
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setParam('categoria', cat.handle)}
              className={`${chipBase} ${
                currentCat === cat.handle
                  ? 'bg-ink text-bone'
                  : 'bg-transparent text-ink hover:bg-acid'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
