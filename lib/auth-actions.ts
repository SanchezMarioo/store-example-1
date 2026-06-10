'use server'

import { redirect } from 'next/navigation'
import { sdk } from './medusa'
import { deleteTokenCookie, getCartCookie, setTokenCookie } from './cookies'

export type AuthActionState = {
  error: string | null
  success: boolean
}

async function transferGuestCart(token: string): Promise<void> {
  const cartId = await getCartCookie()
  if (!cartId) return
  try {
    await sdk.store.cart.transferCart(cartId, undefined, {
      Authorization: `Bearer ${token}`,
    })
  } catch {
    // Non-blocking — login still succeeds if cart transfer fails
  }
}

export async function loginAction(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Completa todos los campos', success: false }
  }

  let shouldRedirect = false

  try {
    const result = await sdk.auth.login('customer', 'emailpass', {
      email,
      password,
    })
    if (typeof result !== 'string') {
      return { error: 'Credenciales incorrectas', success: false }
    }
    await setTokenCookie(result)
    await transferGuestCart(result)
    shouldRedirect = true
  } catch {
    return { error: 'Email o contraseña incorrectos', success: false }
  }

  if (shouldRedirect) redirect('/cuenta')
  return { error: null, success: true }
}

export async function registerAction(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string

  if (!email || !password || !firstName) {
    return { error: 'Completa todos los campos', success: false }
  }

  let shouldRedirect = false

  try {
    const regToken = await sdk.auth.register('customer', 'emailpass', {
      email,
      password,
    })

    await sdk.store.customer.create(
      { first_name: firstName, last_name: lastName ?? '', email },
      undefined,
      { Authorization: `Bearer ${regToken}` }
    )

    const result = await sdk.auth.login('customer', 'emailpass', {
      email,
      password,
    })
    if (typeof result !== 'string') {
      return { error: 'Registro completado, pero el login falló', success: false }
    }

    await setTokenCookie(result)
    await transferGuestCart(result)
    shouldRedirect = true
  } catch (err) {
    const msg = err instanceof Error ? err.message : ''
    if (msg.includes('exists') || msg.includes('email')) {
      return { error: 'Ya existe una cuenta con ese email', success: false }
    }
    return { error: 'Error al crear la cuenta', success: false }
  }

  if (shouldRedirect) redirect('/cuenta')
  return { error: null, success: true }
}

export async function logoutAction(): Promise<void> {
  await deleteTokenCookie()
  redirect('/login')
}
