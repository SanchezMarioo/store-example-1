'use server'

import { sdk } from './medusa'

export async function completeCartAction(cartId: string) {
  return sdk.store.cart.complete(cartId)
}
