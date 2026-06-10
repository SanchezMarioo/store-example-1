import { cookies } from 'next/headers'

export const TOKEN_COOKIE = 'medusa_token'
export const CART_COOKIE = 'medusa_cart_id'

export async function getTokenCookie(): Promise<string | undefined> {
  return (await cookies()).get(TOKEN_COOKIE)?.value
}

export async function setTokenCookie(token: string): Promise<void> {
  ;(await cookies()).set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function deleteTokenCookie(): Promise<void> {
  ;(await cookies()).set(TOKEN_COOKIE, '', { maxAge: 0, path: '/' })
}

export async function getCartCookie(): Promise<string | undefined> {
  return (await cookies()).get(CART_COOKIE)?.value
}
