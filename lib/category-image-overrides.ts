import { HttpTypes } from '@medusajs/types'

type CategoryImageOverride = {
  thumbnail?: string
}

const CATEGORY_IMAGE_OVERRIDES: Record<string, CategoryImageOverride> = {
  hoodies: {
    thumbnail: '/images/hero-men.webp',
  },
  tees: {
    thumbnail: '/images/hero-woman.webp',
  },
  accesorios: {
    thumbnail: '/images/hero-accesories.jpg',
  },
}

function readMetadataImage(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== 'object') return null

  const record = metadata as Record<string, unknown>
  const candidates = ['coverImage', 'cover_image', 'image', 'thumbnail', 'heroImage', 'hero_image']

  for (const key of candidates) {
    const value = record[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }

  return null
}

function resolveCategoryOverride(category: HttpTypes.StoreProductCategory): CategoryImageOverride | null {
  const handle = (category.handle ?? '').trim().toLowerCase()
  if (handle && CATEGORY_IMAGE_OVERRIDES[handle]) return CATEGORY_IMAGE_OVERRIDES[handle]
  return null
}

export function getCategoryThumbnail(category: HttpTypes.StoreProductCategory): string | null {
  const metadataImage = readMetadataImage(category.metadata)
  if (metadataImage) return metadataImage

  const override = resolveCategoryOverride(category)
  return override?.thumbnail ?? null
}