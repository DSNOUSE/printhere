import { statusLabel } from '@/lib/orders'

const statusStyles: Record<string, string> = {
  pending_payment: 'bg-amber-100 text-amber-800',
  payment_failed: 'bg-red-100 text-red-800',
  paid: 'bg-blue-100 text-blue-800',
  in_production: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-600',
}

type Props = {
  status: string
}

export function StatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        statusStyles[status] ?? 'bg-gray-100 text-gray-600'
      }`}
    >
      {statusLabel(status)}
    </span>
  )
}
