'use client'

import { useState } from 'react'
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { HttpTypes } from '@medusajs/types'
import { sdk } from '@/lib/medusa'

type Props = {
  cart: HttpTypes.StoreCart
  onComplete: (order: HttpTypes.StoreOrder) => void
}

export default function StepPayment({ cart, onComplete }: Props) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setIsLoading(true)
    setError(null)

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout?cart_id=${cart.id}`,
        },
        redirect: 'if_required',
      })

      if (stripeError) {
        setError(stripeError.message ?? 'Error al procesar el pago.')
        return
      }

      if (paymentIntent?.status === 'succeeded' || paymentIntent?.status === 'requires_capture') {
        const result = await sdk.store.cart.complete(cart.id)
        if (result.type === 'order') {
          onComplete(result.order)
        } else {
          setError(result.error?.message ?? 'Error al confirmar el pedido.')
        }
      }
    } catch {
      setError('Error inesperado. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <p role="alert" className="text-red-400 text-sm bg-red-950/30 border border-red-900 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <div className="rounded-xl overflow-hidden">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-[#c2410c] hover:bg-[#9a3412] disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-black text-sm uppercase tracking-widest py-4 rounded-xl transition-colors"
      >
        {isLoading ? 'Procesando pago...' : `Pagar $${(cart.total ?? 0).toFixed(2)}`}
      </button>

      <p className="text-zinc-600 text-xs text-center flex items-center justify-center gap-1.5">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Pago seguro con encriptación SSL
      </p>
    </form>
  )
}
