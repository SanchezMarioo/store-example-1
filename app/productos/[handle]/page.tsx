import { sdk } from "@/lib/medusa"
import { notFound } from "next/navigation"
import ProductDetail from "./ProductDetail"

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params

  try {
    const { products } = await sdk.store.product.list({ handle })
    const product = products[0]
    if (!product) notFound()
    return <ProductDetail product={product} />
  } catch (error) {
    console.error("[producto] Error fetching:", error)
    notFound()
  }
}
