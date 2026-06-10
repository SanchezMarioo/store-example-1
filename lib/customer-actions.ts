'use server'

import { sdk } from './medusa'
import { getTokenCookie } from './cookies'

export type CustomerActionState = {
  error: string | null
  success: boolean
}

export async function updateCustomerAction(
  _prev: CustomerActionState,
  formData: FormData
): Promise<CustomerActionState> {
  const token = await getTokenCookie()
  if (!token) return { error: 'No autenticado', success: false }

  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string

  if (!firstName) return { error: 'El nombre es obligatorio', success: false }

  try {
    await sdk.store.customer.update(
      { first_name: firstName, last_name: lastName ?? '' },
      undefined,
      { Authorization: `Bearer ${token}` }
    )
    return { error: null, success: true }
  } catch {
    return { error: 'Error al actualizar los datos', success: false }
  }
}
