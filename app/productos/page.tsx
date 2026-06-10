import { sdk } from "@/lib/medusa"
import ProductCard from "./ProductCard"

export default async function ProductosPage() {
  let products: Awaited<ReturnType<typeof sdk.store.product.list>>["products"] = []

  try {
    const result = await sdk.store.product.list()
    products = result.products
  } catch (error) {
    console.error("[productos] Error fetching:", error)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-12 sm:px-8 lg:px-16">
      <h1 className="text-white font-black text-3xl sm:text-4xl uppercase tracking-tight mb-10">
        Productos
      </h1>

      {products.length === 0 ? (
        <p className="text-zinc-500 text-center mt-24">
          No hay productos disponibles.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  )
}
