import { HttpTypes } from '@medusajs/types'
import { sdk } from '@/lib/medusa'
import { getDefaultRegionId } from '@/lib/region'
import { notFound } from 'next/navigation'
import ProductDetail from './ProductDetail'

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const regionId = await getDefaultRegionId()

  let product: HttpTypes.StoreProduct | undefined
  try {
    const { products } = await sdk.store.product.list({ handle, region_id: regionId })
    product = products[0]
  } catch (error) {
    console.error('[producto] Error fetching:', error)
  }

  if (!product) notFound()

  return <ProductDetail product={product} />
}
