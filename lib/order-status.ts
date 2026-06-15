import { HttpTypes } from '@medusajs/types'

export type OrderBadge = { label: string; classes: string }

export function orderBadge(order: HttpTypes.StoreOrder): OrderBadge {
  if (order.status === 'canceled') {
    return { label: 'Cancelado', classes: 'border-error text-error' }
  }
  if (
    order.fulfillment_status === 'delivered' ||
    order.fulfillment_status === 'partially_delivered'
  ) {
    return { label: 'Entregado', classes: 'border-success text-success' }
  }
  if (
    order.fulfillment_status === 'shipped' ||
    order.fulfillment_status === 'partially_shipped'
  ) {
    return { label: 'En camino', classes: 'border-acid text-ink' }
  }
  return { label: 'En preparación', classes: 'border-ink text-ink' }
}
