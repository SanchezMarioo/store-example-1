import { cache } from 'react'
import { HttpTypes } from '@medusajs/types'
import { sdk } from './medusa'
import { getDefaultRegionId } from './region'

export const getCategories = cache(
  async (): Promise<HttpTypes.StoreProductCategory[]> => {
    try {
      const { product_categories } = await sdk.store.category.list({
        fields: 'id,name,handle',
        limit: 100,
      })
      return product_categories
    } catch {
      return []
    }
  }
)

export const getCollections = cache(
  async (): Promise<HttpTypes.StoreCollection[]> => {
    try {
      const { collections } = await sdk.store.collection.list({
        fields: 'id,title,handle',
        limit: 100,
      })
      return collections
    } catch {
      return []
    }
  }
)

export const getCategoryByHandle = cache(
  async (handle: string): Promise<HttpTypes.StoreProductCategory | null> => {
    try {
      const { product_categories } = await sdk.store.category.list({ handle })
      return product_categories[0] ?? null
    } catch {
      return null
    }
  }
)

export const getCollectionByHandle = cache(
  async (handle: string): Promise<HttpTypes.StoreCollection | null> => {
    try {
      const { collections } = await sdk.store.collection.list({ handle })
      return collections[0] ?? null
    } catch {
      return null
    }
  }
)

export type ProductSort = 'novedad' | 'precio-asc' | 'precio-desc'

const ORDER_MAP: Record<ProductSort, string> = {
  novedad: '-created_at',
  'precio-asc': 'variants.calculated_price',
  'precio-desc': '-variants.calculated_price',
}

type ListParams = {
  q?: string
  categoryId?: string
  collectionId?: string
  sort?: ProductSort
  limit?: number
  offset?: number
}

export async function listProducts(
  params: ListParams = {}
): Promise<HttpTypes.StoreProduct[]> {
  const regionId = await getDefaultRegionId()
  const order = params.sort ? ORDER_MAP[params.sort] : undefined

  try {
    const { products } = await sdk.store.product.list({
      region_id: regionId,
      limit: params.limit ?? 100,
      offset: params.offset,
      ...(params.q ? { q: params.q } : {}),
      ...(params.categoryId ? { category_id: params.categoryId } : {}),
      ...(params.collectionId ? { collection_id: params.collectionId } : {}),
      ...(order ? { order } : {}),
    })
    return products
  } catch (error) {
    console.error('[catalog] listProducts error:', error)
    return []
  }
}
