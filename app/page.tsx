import { sdk } from "@/lib/medusa"

export default async function Home() {
  try {
    const { products } = await sdk.store.product.list()
    console.log("Productos:", products)
  } catch (error) {
    console.error("Backend no disponible:", error)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] text-white">
      <a
        href="/productos"
        className="text-[#c2410c] font-bold text-lg hover:underline"
      >
        Ver productos →
      </a>
    </div>
  )
}
