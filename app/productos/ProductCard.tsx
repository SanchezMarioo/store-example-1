import Link from "next/link"
import { HttpTypes } from "@medusajs/types"

type Props = {
  product: HttpTypes.StoreProduct
}

export default function ProductCard({ product }: Props) {
  const price = product.variants?.[0]?.calculated_price?.calculated_amount

  return (
    <Link href={`/productos/${product.handle}`}>
    <article className="bg-zinc-900 rounded-xl overflow-hidden group flex flex-col">
      <div className="aspect-square bg-zinc-800 relative overflow-hidden">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title ?? "Producto"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-zinc-600 text-sm">Sin imagen</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-1 flex-1">
        <h2 className="text-white font-bold text-base leading-snug">
          {product.title}
        </h2>
        {price != null ? (
          <p className="text-[#c2410c] font-black text-lg mt-auto pt-2">
            ${price.toFixed(2)}
          </p>
        ) : (
          <p className="text-zinc-500 text-sm mt-auto pt-2">Consultar precio</p>
        )}
      </div>
    </article>
    </Link>
  )
}
