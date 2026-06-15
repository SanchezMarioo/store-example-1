'use client'

import { useState } from 'react'
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { HttpTypes } from '@medusajs/types'
import { completeCartAction } from '@/lib/checkout-actions'
import { alertError, buttonPrimary, spinnerSquare } from '@/lib/ui'

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
        const result = await completeCartAction(cart.id)
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
        <p role="alert" className={alertError}>
          {error}
        </p>
      )}

      <PaymentElement options={{ layout: 'tabs' }} />

      <button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className={`${buttonPrimary} h-12 w-full tabular-nums`}
      >
        {isLoading && <span aria-hidden className={spinnerSquare} />}
        {isLoading ? 'Procesando pago' : `Pagar $${(cart.total ?? 0).toFixed(2)}`}
      </button>

      <p className="flex items-center justify-center gap-2 text-caption font-bold uppercase tracking-widest text-zinc-mid">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Pago seguro con encriptación SSL
      </p>
    </form>
  )
}
