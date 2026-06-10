'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { HttpTypes } from '@medusajs/types'
import { sdk } from './medusa'

type CartContextType = {
  cart: HttpTypes.StoreCart | null
  itemCount: number
  isLoading: boolean
  addItem: (variantId: string, quantity?: number) => Promise<void>
  updateItem: (lineItemId: string, quantity: number) => Promise<void>
  removeItem: (lineItemId: string) => Promise<void>
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

const FIELDS = '+items,+items.thumbnail,+items.variant,+items.product'
const CART_COOKIE = 'medusa_cart_id'

function getCookieClient(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
  return undefined
}

function setCookieClient(name: string, value: string, days = 30): void {
  if (typeof document === 'undefined') return
  const expires = new Date(Date.now() + days * 86400 * 1000).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`
}

function deleteCookieClient(name: string): void {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const id = getCookieClient(CART_COOKIE)
    if (!id) return
    sdk.store.cart
      .retrieve(id, { fields: FIELDS })
      .then(({ cart }) => setCart(cart))
      .catch(() => deleteCookieClient(CART_COOKIE))
  }, [])

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      setIsLoading(true)
      try {
        let cartId = cart?.id ?? getCookieClient(CART_COOKIE)

        if (!cartId) {
          const { cart: fresh } = await sdk.store.cart.create({})
          setCookieClient(CART_COOKIE, fresh.id)
          setCart(fresh)
          cartId = fresh.id
        }

        const { cart: updated } = await sdk.store.cart.createLineItem(
          cartId,
          { variant_id: variantId, quantity },
          { fields: FIELDS }
        )
        setCart(updated)
      } finally {
        setIsLoading(false)
      }
    },
    [cart]
  )

  const updateItem = useCallback(
    async (lineItemId: string, quantity: number) => {
      if (!cart) return
      setIsLoading(true)
      try {
        const { cart: updated } = await sdk.store.cart.updateLineItem(
          cart.id,
          lineItemId,
          { quantity },
          { fields: FIELDS }
        )
        setCart(updated)
      } finally {
        setIsLoading(false)
      }
    },
    [cart]
  )

  const removeItem = useCallback(
    async (lineItemId: string) => {
      if (!cart) return
      setIsLoading(true)
      try {
        await sdk.store.cart.deleteLineItem(cart.id, lineItemId)
        const { cart: updated } = await sdk.store.cart.retrieve(cart.id, {
          fields: FIELDS,
        })
        setCart(updated)
      } finally {
        setIsLoading(false)
      }
    },
    [cart]
  )

  const clearCart = useCallback(() => {
    setCart(null)
    deleteCookieClient(CART_COOKIE)
  }, [])

  const itemCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  return (
    <CartContext.Provider
      value={{ cart, itemCount, isLoading, addItem, updateItem, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
