import Link from 'next/link'
import type { Order } from '@/lib/supabase'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { formatNaira, shortOrderId } from '@/lib/orders'

type Props = {
  orders: Order[]
}

export function OrderTable({ orders }: Props) {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-border p-12 text-center text-gray-500">
        No orders found.
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-border text-left text-gray-500">
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Total</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-cream/50 transition-colors">
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-semibold text-teal hover:underline"
                  >
                    {shortOrderId(order.id)}
                  </Link>
                </td>
                <td className="px-5 py-4">
                  <p className="font-medium text-gray-900">{order.customer_name}</p>
                  <p className="text-gray-500 text-xs">{order.customer_email}</p>
                </td>
                <td className="px-5 py-4">
                  <p>{order.product_name}</p>
                  <p className="text-gray-500 text-xs">Qty {order.quantity}</p>
                </td>
                <td className="px-5 py-4 font-medium">{formatNaira(order.total_price)}</td>
                <td className="px-5 py-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                  {new Date(order.created_at).toLocaleDateString('en-NG', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
