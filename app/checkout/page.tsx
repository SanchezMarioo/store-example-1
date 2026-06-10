'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { HttpTypes } from '@medusajs/types'
import Link from 'next/link'

import { sdk } from '@/lib/medusa'
import { getCookieClient } from '@/lib/cookies-client'
import { useCart } from '@/lib/cart-context'

import OrderSummary from './OrderSummary'
import StepShipping from './StepShipping'
import StepDelivery from './StepDelivery'
import StepPayment from './StepPayment'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

const CHECKOUT_FIELDS =
  '+region,+region.countries,+shipping_address,+shipping_methods,+payment_collection,+payment_collection.payment_sessions,+items,+items.thumbnail,+items.variant,+items.product'

type Step = 1 | 2 | 3

type ShippingOption = HttpTypes.StoreCartShippingOptionWithServiceZone

const STEPS = ['Envío', 'Entrega', 'Pago']

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { clearCart } = useCart()

  const [step, setStep] = useState<Step>(1)
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null)
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([])
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoadingPage, setIsLoadingPage] = useState(true)
  const [pageError, setPageError] = useState<string | null>(null)

  const loadCart = useCallback(async () => {
    const cartId = searchParams.get('cart_id') ?? getCookieClient('medusa_cart_id')
    if (!cartId) {
      router.replace('/carrito')
      return
    }

    try {
      let { cart: loaded } = await sdk.store.cart.retrieve(cartId, {
        fields: CHECKOUT_FIELDS,
      })

      if (!loaded.region_id) {
        const { regions } = await sdk.store.region.list()
        if (regions.length > 0) {
          const { cart: withRegion } = await sdk.store.cart.update(cartId, {
            region_id: regions[0].id,
          })
          const { cart: refreshed } = await sdk.store.cart.retrieve(cartId, {
            fields: CHECKOUT_FIELDS,
          })
          loaded = refreshed ?? withRegion
        }
      }

      if (!loaded.items?.length) {
        router.replace('/carrito')
        return
      }

      setCart(loaded)

      const redirectStatus = searchParams.get('redirect_status')
      const redirectCartId = searchParams.get('cart_id')
      if (redirectStatus === 'succeeded' && redirectCartId) {
        const result = await sdk.store.cart.complete(redirectCartId)
        if (result.type === 'order') {
          handleOrderComplete(result.order)
        }
      }
    } catch {
      setPageError('No se pudo cargar el carrito.')
    } finally {
      setIsLoadingPage(false)
    }
  }, [])

  useEffect(() => {
    loadCart()
  }, [loadCart])

  const handleShippingComplete = async (updatedCart: HttpTypes.StoreCart) => {
    setCart(updatedCart)
    setIsLoadingPage(true)
    try {
      const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
        cart_id: updatedCart.id,
      })
      setShippingOptions(shipping_options)
      setStep(2)
    } catch {
      setPageError('No se pudieron cargar las opciones de envío.')
    } finally {
      setIsLoadingPage(false)
    }
  }

  const handleDeliveryComplete = async (updatedCart: HttpTypes.StoreCart) => {
    setCart(updatedCart)
    setIsLoadingPage(true)
    try {
      const { cart: refreshed } = await sdk.store.cart.retrieve(updatedCart.id, {
        fields: CHECKOUT_FIELDS,
      })
      setCart(refreshed)

      const { payment_providers } = await sdk.store.payment.listPaymentProviders({
        region_id: refreshed.region_id ?? '',
      })

      const stripeProvider = payment_providers.find((p) =>
        p.id.includes('stripe')
      )
      const providerId = stripeProvider?.id ?? payment_providers[0]?.id

      if (!providerId) {
        setPageError('No hay métodos de pago disponibles.')
        return
      }

      const { payment_collection } = await sdk.store.payment.initiatePaymentSession(
        refreshed,
        { provider_id: providerId },
        { fields: '+payment_sessions.data' }
      )

      const secret = payment_collection.payment_sessions?.[0]?.data
        ?.client_secret as string | undefined

      if (!secret) {
        const providerError = `Stripe no devolvió client_secret. Proveedor usado: ${providerId}. Asegúrate de que Stripe esté activado en la región en el Medusa Admin (Settings → Regions → Payment Providers).`
        setPageError(providerError)
        return
      }

      setClientSecret(secret)
      setStep(3)
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      setPageError(`Error al inicializar el pago: ${msg || 'intenta de nuevo.'}`)
    } finally {
      setIsLoadingPage(false)
    }
  }

  const handleOrderComplete = useCallback(
    (order: HttpTypes.StoreOrder) => {
      clearCart()
      sessionStorage.setItem('last_order', JSON.stringify(order))
      router.push('/pedido-confirmado')
    },
    [clearCart, router]
  )

  if (pageError) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center flex flex-col gap-4">
          <p className="text-red-400">{pageError}</p>
          <Link href="/carrito" className="text-[#c2410c] hover:underline text-sm">
            ← Volver al carrito
          </Link>
        </div>
      </main>
    )
  }

  if (isLoadingPage && !cart) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#c2410c] border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm">Cargando checkout...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-10 sm:px-8 lg:px-16">
      <Link
        href="/carrito"
        className="text-zinc-500 text-sm hover:text-white transition-colors mb-8 inline-block"
      >
        ← Volver al carrito
      </Link>

      <div className="flex flex-col lg:flex-row gap-12 mt-2">
        <div className="flex-1">
          <div className="mb-8">
            <nav className="flex gap-2 items-center" aria-label="Progreso del checkout">
              {STEPS.map((label, i) => {
                const stepNum = (i + 1) as Step
                const isDone = step > stepNum
                const isCurrent = step === stepNum
                return (
                  <div key={label} className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                        isDone
                          ? 'bg-green-700 text-white'
                          : isCurrent
                            ? 'bg-[#c2410c] text-white'
                            : 'bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {isDone ? '✓' : stepNum}
                    </div>
                    <span
                      className={`text-xs font-bold uppercase tracking-widest ${
                        isCurrent ? 'text-white' : isDone ? 'text-zinc-400' : 'text-zinc-600'
                      }`}
                    >
                      {label}
                    </span>
                    {i < STEPS.length - 1 && (
                      <div className="w-6 h-px bg-zinc-800 mx-1" />
                    )}
                  </div>
                )
              })}
            </nav>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-6 sm:p-8">
            <h2 className="text-white font-black text-lg uppercase tracking-tight mb-6">
              {STEPS[step - 1]}
            </h2>

            {step === 1 && cart && (
              <StepShipping cart={cart} onComplete={handleShippingComplete} />
            )}

            {step === 2 && cart && (
              <StepDelivery
                cart={cart}
                shippingOptions={shippingOptions}
                onComplete={handleDeliveryComplete}
              />
            )}

            {step === 3 && cart && clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'night',
                    variables: {
                      colorPrimary: '#c2410c',
                      colorBackground: '#18181b',
                      colorText: '#ffffff',
                      colorTextSecondary: '#a1a1aa',
                      borderRadius: '12px',
                      fontFamily: 'var(--font-geist), system-ui, sans-serif',
                    },
                  },
                }}
              >
                <StepPayment cart={cart} onComplete={handleOrderComplete} />
              </Elements>
            )}

            {step === 3 && cart && !clientSecret && (
              <div className="flex items-center gap-3 text-zinc-500">
                <div className="w-5 h-5 border-2 border-[#c2410c] border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Iniciando sesión de pago...</span>
              </div>
            )}
          </div>
        </div>

        <OrderSummary cart={cart} />
      </div>
    </main>
  )
}
