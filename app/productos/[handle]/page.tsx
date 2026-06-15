import { notFound } from 'next/navigation'
import { getProductByHandle } from '@/lib/catalog'
import ProductDetail from './ProductDetail'

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const product = await getProductByHandle(handle)
  if (!product) notFound()
  return <ProductDetail product={product} />
}
