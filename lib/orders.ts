export const ORDER_STATUSES = [
  'pending_payment',
  'payment_failed',
  'paid',
  'in_production',
  'shipped',
  'completed',
  'cancelled',
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

export const STAFF_VISIBLE_STATUSES: OrderStatus[] = [
  'paid',
  'in_production',
  'shipped',
  'completed',
  'cancelled',
  'pending_payment',
  'payment_failed',
]

const ALLOWED_TRANSITIONS: Record<string, OrderStatus[]> = {
  pending_payment: ['cancelled'],
  payment_failed: ['cancelled'],
  paid: ['in_production', 'cancelled'],
  in_production: ['shipped', 'cancelled'],
  shipped: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
}

export function getNextStatuses(current: string): OrderStatus[] {
  return ALLOWED_TRANSITIONS[current] ?? []
}

export function canTransition(from: string, to: string): boolean {
  return getNextStatuses(from).includes(to as OrderStatus)
}

export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending_payment: 'Pending Payment',
    payment_failed: 'Payment Failed',
    paid: 'Paid',
    in_production: 'In Production',
    shipped: 'Shipped',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }
  return labels[status] ?? status
}

export function defaultStatusMessage(status: OrderStatus): string {
  const messages: Record<OrderStatus, string> = {
    pending_payment: 'Your order is awaiting payment.',
    payment_failed: 'Payment for your order could not be processed.',
    paid: 'Your payment has been confirmed. We will begin processing your order shortly.',
    in_production: 'Your order is now in production. We will notify you when it ships.',
    shipped: 'Your order has been dispatched and is on its way to you.',
    completed: 'Your order is complete. Thank you for choosing PrintHere!',
    cancelled: 'Your order has been cancelled. If you have questions, please contact us.',
  }
  return messages[status]
}

export function shortOrderId(id: string): string {
  return `#${id.slice(0, 8).toUpperCase()}`
}

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
