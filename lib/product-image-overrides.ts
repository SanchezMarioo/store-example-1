import { HttpTypes } from '@medusajs/types'
import { drop } from './mock-drop'

type ProductImageOverride = {
  thumbnail?: string
  gallery?: string[]
}

const PRODUCT_IMAGE_OVERRIDES: Record<string, ProductImageOverride> = Object.fromEntries(
  drop.products.map((product) => [
    product.handle,
    {
      thumbnail: product.images[0],
      gallery: product.images,
    },
  ])
)

function resolveOverride(product: HttpTypes.StoreProduct): ProductImageOverride | null {
  const handle = (product.handle ?? '').trim().toLowerCase()
  if (handle && PRODUCT_IMAGE_OVERRIDES[handle]) return PRODUCT_IMAGE_OVERRIDES[handle]
  return null
}

export function getProductThumbnail(product: HttpTypes.StoreProduct): string | null {
  const override = resolveOverride(product)
  return override?.thumbnail ?? product.thumbnail ?? null
}

export function getProductGallery(
  product: HttpTypes.StoreProduct
): HttpTypes.StoreProductImage[] {
  const override = resolveOverride(product)

  if (override?.gallery?.length) {
    return override.gallery.map(
      (url, index) =>
        ({ id: `override-${index + 1}`, url, rank: index } as HttpTypes.StoreProductImage)
    )
  }

  if (product.images && product.images.length > 0) {
    return product.images.reduce<HttpTypes.StoreProductImage[]>((acc, img, index) => {
      if (typeof img.url === 'string' && img.url.length > 0) {
        acc.push({ ...img, rank: img.rank ?? index })
      }
      return acc
    }, [])
  }

  const thumbnail = getProductThumbnail(product)
  return thumbnail
    ? ([{ id: 'thumbnail', url: thumbnail, rank: 0 }] as HttpTypes.StoreProductImage[])
    : []
}
