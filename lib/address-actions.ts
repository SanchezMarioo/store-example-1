'use server'

import { revalidatePath } from 'next/cache'
import { HttpTypes } from '@medusajs/types'
import { sdk } from './medusa'
import { getTokenCookie } from './cookies'

export type AddressActionState = {
  error: string | null
  success: boolean
}

async function authHeaders() {
  const token = await getTokenCookie()
  if (!token) throw new Error('No autenticado')
  return { Authorization: `Bearer ${token}` }
}

export async function listAddresses(): Promise<HttpTypes.StoreCustomerAddress[]> {
  try {
    const headers = await authHeaders()
    const { addresses } = await sdk.store.customer.listAddress(undefined, headers)
    return addresses
  } catch {
    return []
  }
}

function bodyFromForm(formData: FormData): HttpTypes.StoreCreateCustomerAddress {
  const str = (key: string) => {
    const v = formData.get(key)
    return typeof v === 'string' && v.trim() ? v.trim() : undefined
  }
  return {
    first_name: str('first_name'),
    last_name: str('last_name'),
    company: str('company'),
    address_1: str('address_1'),
    address_2: str('address_2'),
    city: str('city'),
    postal_code: str('postal_code'),
    province: str('province'),
    country_code: str('country_code'),
    phone: str('phone'),
    is_default_shipping: formData.get('is_default_shipping') === 'on',
  }
}

export async function saveAddress(
  _prev: AddressActionState,
  formData: FormData
): Promise<AddressActionState> {
  const id = formData.get('id')
  const body = bodyFromForm(formData)

  if (!body.first_name || !body.address_1 || !body.city || !body.postal_code || !body.country_code) {
    return { error: 'Completa los campos obligatorios', success: false }
  }

  try {
    const headers = await authHeaders()
    if (typeof id === 'string' && id) {
      await sdk.store.customer.updateAddress(id, body, undefined, headers)
    } else {
      await sdk.store.customer.createAddress(body, undefined, headers)
    }
    revalidatePath('/cuenta/direcciones')
    return { error: null, success: true }
  } catch {
    return { error: 'No se pudo guardar la dirección', success: false }
  }
}

export async function deleteAddress(id: string): Promise<void> {
  const headers = await authHeaders()
  await sdk.store.customer.deleteAddress(id, headers)
  revalidatePath('/cuenta/direcciones')
}

export async function setDefaultAddress(id: string): Promise<void> {
  const headers = await authHeaders()
  await sdk.store.customer.updateAddress(
    id,
    { is_default_shipping: true },
    undefined,
    headers
  )
  revalidatePath('/cuenta/direcciones')
}
