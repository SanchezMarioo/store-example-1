'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { HttpTypes } from '@medusajs/types'
import Link from 'next/link'

import { sdk } from '@/lib/medusa'
import { completeCartAction } from '@/lib/checkout-actions'
import { getCookieClient } from '@/lib/cookies-client'
import { useCart } from '@/lib/cart-context'
import { spinnerSquare } from '@/lib/ui'

import OrderSummary from './OrderSummary'
import StepShipping from './StepShipping'
import StepDelivery from './StepDelivery'
import StepPayment from './StepPayment'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

const CHECKOUT_FIELDS =
  '+region,+region.countries,+shipping_address,+shipping_methods,+payment_collection,+payment_collection.payment_sessions,+items,+items.thumbnail,+items.variant,+items.product,+promotions'

type Step = 1 | 2 | 3

type ShippingOption = HttpTypes.StoreCartShippingOptionWithServiceZone

const STEPS = ['Envío', 'Entrega', 'Pago']

const stripeAppearance = {
  variables: {
    colorPrimary: '#0E0E0E',
    colorBackground: '#F2F1EC',
    colorText: '#0E0E0E',
    colorTextSecondary: '#52525B',
    colorDanger: '#DC2626',
    borderRadius: '0px',
    fontFamily: 'Epilogue, system-ui, sans-serif',
  },
}

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

  const handleOrderComplete = useCallback(
    (order: HttpTypes.StoreOrder) => {
      clearCart()
      sessionStorage.setItem('last_order', JSON.stringify(order))
      router.push('/pedido-confirmado')
    },
    [clearCart, router]
  )

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
        const result = await completeCartAction(redirectCartId)
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

  if (pageError) {
    return (
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="flex max-w-md flex-col gap-6 border-2 border-error bg-cement-light p-8">
          <p className="text-sm font-bold text-error">{pageError}</p>
          <Link
            href="/carrito"
            className="text-caption font-bold uppercase tracking-widest text-ink underline decoration-acid decoration-2 underline-offset-4 transition duration-150 hover:bg-acid"
          >
            ← Volver al carrito
          </Link>
        </div>
      </main>
    )
  }

  if (isLoadingPage && !cart) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span aria-hidden className={`${spinnerSquare} h-5 w-5`} />
          <p className="text-caption font-bold uppercase tracking-widest text-zinc-mid">
            Cargando checkout
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <Link
          href="/carrito"
          className="text-caption font-bold uppercase tracking-widest text-zinc-mid transition duration-150 hover:text-ink"
        >
          ← Volver al carrito
        </Link>

        <div className="mt-6 flex flex-col gap-8 lg:flex-row-reverse lg:gap-12">
          <OrderSummary
            cart={cart}
            onCartUpdate={setCart}
            promoFields={CHECKOUT_FIELDS}
          />

          <div className="flex-1">
            <nav className="mb-8 flex flex-wrap items-center gap-2" aria-label="Progreso del checkout">
              {STEPS.map((label, i) => {
                const stepNum = (i + 1) as Step
                const isDone = step > stepNum
                const isCurrent = step === stepNum
                const indicator = isDone
                  ? 'bg-ink text-bone'
                  : isCurrent
                    ? 'bg-acid text-ink'
                    : 'bg-transparent text-zinc-mid'
                return (
                  <div key={label} className="flex items-center gap-2">
                    {isDone ? (
                      <button
                        type="button"
                        onClick={() => setStep(stepNum)}
                        className="flex items-center gap-2"
                      >
                        <span className={`flex h-7 w-7 items-center justify-center border-2 border-ink text-xs font-bold ${indicator}`}>
                          ✓
                        </span>
                        <span className="text-caption font-bold uppercase tracking-widest text-zinc-mid transition duration-150 hover:text-ink">
                          {label}
                        </span>
                      </button>
                    ) : (
                      <>
                        <span className={`flex h-7 w-7 items-center justify-center border-2 border-ink text-xs font-bold ${indicator}`}>
                          {stepNum}
                        </span>
                        <span
                          className={`text-caption font-bold uppercase tracking-widest ${
                            isCurrent ? 'text-ink' : 'text-zinc-mid'
                          }`}
                        >
                          {label}
                        </span>
                      </>
                    )}
                    {i < STEPS.length - 1 && <span className="mx-1 h-0.5 w-6 bg-ink" />}
                  </div>
                )
              })}
            </nav>

            <div className="border-2 border-ink bg-cement-light p-6 sm:p-8">
              <h2 className="mb-6 font-display text-2xl uppercase tracking-tight text-ink">
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
                  options={{ clientSecret, appearance: stripeAppearance }}
                >
                  <StepPayment cart={cart} onComplete={handleOrderComplete} />
                </Elements>
              )}

              {step === 3 && cart && !clientSecret && (
                <div className="flex items-center gap-3">
                  <span aria-hidden className={spinnerSquare} />
                  <span className="text-caption font-bold uppercase tracking-widest text-zinc-mid">
                    Iniciando sesión de pago
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
