import { cache } from 'react'
import { HttpTypes } from '@medusajs/types'
import { sdk } from './medusa'
import { getDefaultRegionId } from './region'
import { drop, Product as MockProduct } from './mock-drop'

const DEMO_COLLECTION_HANDLE = 'asfalto-04'

const DEMO_CATEGORIES: HttpTypes.StoreProductCategory[] = [
  {
    id: 'cat-hoodies',
    name: 'Hoodies',
    handle: 'hoodies',
    description: 'Capas pesadas y sudaderas de corte limpio.',
    metadata: { coverImage: '/images/hero-men.webp' },
  } as HttpTypes.StoreProductCategory,
  {
    id: 'cat-tees',
    name: 'Tees',
    handle: 'tees',
    description: 'Camisetas con gráfico y algodón compacto.',
    metadata: { coverImage: '/images/hero-woman.webp' },
  } as HttpTypes.StoreProductCategory,
]

const DEMO_COLLECTIONS: HttpTypes.StoreCollection[] = [
  {
    id: 'col-asfalto-04',
    title: `Drop ${drop.number} · ${drop.name}`,
    handle: DEMO_COLLECTION_HANDLE,
  } as HttpTypes.StoreCollection,
]

function getDemoCategory(product: MockProduct): HttpTypes.StoreProductCategory {
  const isHoodie = product.handle.startsWith('hoodie-')
  return isHoodie ? DEMO_CATEGORIES[0] : DEMO_CATEGORIES[1]
}

function toStoreProduct(product: MockProduct): HttpTypes.StoreProduct {
  const category = getDemoCategory(product)
  const sizeOptionId = `${product.id}-option-size`

  const options: HttpTypes.StoreProductOption[] = [
    {
      id: sizeOptionId,
      title: 'Talla',
      values: product.variants.map((variant) => ({
        id: `${product.id}-${variant.size.toLowerCase()}-value`,
        value: variant.size,
      })),
    } as HttpTypes.StoreProductOption,
  ]

  const variants: HttpTypes.StoreProductVariant[] = product.variants.map((variant) => ({
    id: variant.id,
    title: variant.size,
    manage_inventory: true,
    allow_backorder: false,
    inventory_quantity: variant.available ? 5 : 0,
    options: [{ option_id: sizeOptionId, value: variant.size }],
    calculated_price: {
      calculated_amount: product.price,
    },
  })) as HttpTypes.StoreProductVariant[]

  return {
    id: product.id,
    title: product.name,
    handle: product.handle,
    description: product.details,
    thumbnail: product.images[0] ?? null,
    images: product.images.map((url, index) => ({ id: `${product.id}-img-${index + 1}`, url })),
    options,
    variants,
    categories: [category],
    collection_id: DEMO_COLLECTIONS[0].id,
  } as HttpTypes.StoreProduct
}

const DEMO_PRODUCTS = drop.products.map(toStoreProduct)

function sortProducts(
  products: HttpTypes.StoreProduct[],
  sort?: ProductSort
): HttpTypes.StoreProduct[] {
  if (!sort || sort === 'novedad') return products

  const getPrice = (product: HttpTypes.StoreProduct) =>
    product.variants?.[0]?.calculated_price?.calculated_amount ?? 0

  return [...products].sort((a, b) => {
    if (sort === 'precio-asc') return getPrice(a) - getPrice(b)
    return getPrice(b) - getPrice(a)
  })
}

function listDemoProducts(params: ListParams = {}): HttpTypes.StoreProduct[] {
  let products = [...DEMO_PRODUCTS]

  if (params.q) {
    const q = params.q.toLowerCase()
    products = products.filter((product) => {
      const title = product.title?.toLowerCase() ?? ''
      const description = product.description?.toLowerCase() ?? ''
      return title.includes(q) || description.includes(q)
    })
  }

  if (params.categoryId) {
    products = products.filter((product) =>
      product.categories?.some((category) => category.id === params.categoryId)
    )
  }

  if (params.collectionId) {
    products = products.filter((product) => product.collection_id === params.collectionId)
  }

  products = sortProducts(products, params.sort)

  const offset = params.offset ?? 0
  const limit = params.limit ?? products.length
  return products.slice(offset, offset + limit)
}

export const getCategories = cache(
  async (): Promise<HttpTypes.StoreProductCategory[]> => {
    try {
      const { product_categories } = await sdk.store.category.list({
        fields: 'id,name,handle,description,metadata',
        limit: 100,
      })
      return product_categories
    } catch {
      return DEMO_CATEGORIES
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
      return DEMO_COLLECTIONS
    }
  }
)

export const getCategoryByHandle = cache(
  async (handle: string): Promise<HttpTypes.StoreProductCategory | null> => {
    try {
      const { product_categories } = await sdk.store.category.list({
        handle,
        fields: 'id,name,handle,description,metadata',
      })
      return product_categories[0] ?? null
    } catch {
      return DEMO_CATEGORIES.find((category) => category.handle === handle) ?? null
    }
  }
)

export const getCollectionByHandle = cache(
  async (handle: string): Promise<HttpTypes.StoreCollection | null> => {
    try {
      const { collections } = await sdk.store.collection.list({ handle })
      return collections[0] ?? null
    } catch {
      return DEMO_COLLECTIONS.find((collection) => collection.handle === handle) ?? null
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
  let regionId: string | null = null
  try {
    regionId = (await getDefaultRegionId()) ?? null
  } catch {
    regionId = null
  }
  const order = params.sort ? ORDER_MAP[params.sort] : undefined

  try {
    if (!regionId) return listDemoProducts(params)

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
    return listDemoProducts(params)
  }
}

export const getProductByHandle = cache(
  async (handle: string): Promise<HttpTypes.StoreProduct | null> => {
    let regionId: string | null = null
    try {
      regionId = (await getDefaultRegionId()) ?? null
    } catch {
      regionId = null
    }

    if (regionId) {
      try {
        const { products } = await sdk.store.product.list({ handle, region_id: regionId })
        if (products[0]) return products[0]
      } catch (error) {
        console.error('[catalog] getProductByHandle error:', error)
      }
    }

    return DEMO_PRODUCTS.find((product) => product.handle === handle) ?? null
  }
)
