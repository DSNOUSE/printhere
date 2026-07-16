import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase-server'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { StatusActionPanel } from '@/components/admin/StatusActionPanel'
import { OrderTimeline } from '@/components/admin/OrderTimeline'
import { formatNaira, shortOrderId } from '@/lib/orders'
import type { Order, OrderStatusHistory } from '@/lib/supabase'

type Props = {
  params: Promise<{ id: string }>
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params

  const { data: order } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (!order) {
    notFound()
  }

  const { data: history } = await supabaseAdmin
    .from('order_status_history')
    .select('*, profiles(full_name, email)')
    .eq('order_id', id)
    .order('created_at', { ascending: false })

  const typedOrder = order as Order
  const typedHistory = (history ?? []) as OrderStatusHistory[]

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <Link href="/admin/orders" className="text-sm text-teal hover:underline">
          ← Back to orders
        </Link>
        <div className="flex items-center gap-3 mt-2">
          <h1 className="text-2xl font-bold text-gray-900">{shortOrderId(typedOrder.id)}</h1>
          <StatusBadge status={typedOrder.status} />
        </div>
        <p className="text-gray-500 text-sm mt-1">
          Placed {new Date(typedOrder.created_at).toLocaleString('en-NG')}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Customer</h2>
            <dl className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">Name</dt>
                <dd className="font-medium mt-0.5">{typedOrder.customer_name}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Email</dt>
                <dd className="font-medium mt-0.5">
                  <a href={`mailto:${typedOrder.customer_email}`} className="text-teal hover:underline">
                    {typedOrder.customer_email}
                  </a>
                </dd>
              </div>
            </dl>
            {typedOrder.notes && (
              <div className="mt-4 pt-4 border-t border-border">
                <dt className="text-gray-500 text-sm">Customer notes</dt>
                <dd className="text-sm mt-1">{typedOrder.notes}</dd>
              </div>
            )}
          </section>

          <section className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Order details</h2>
            <dl className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-gray-500">Product</dt>
                <dd className="font-medium mt-0.5">{typedOrder.product_name}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Quantity</dt>
                <dd className="font-medium mt-0.5">{typedOrder.quantity}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Unit price</dt>
                <dd className="font-medium mt-0.5">{formatNaira(typedOrder.unit_price)}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Total</dt>
                <dd className="font-bold mt-0.5 text-teal">{formatNaira(typedOrder.total_price)}</dd>
              </div>
              {typedOrder.paystack_reference && (
                <div className="sm:col-span-2">
                  <dt className="text-gray-500">Payment reference</dt>
                  <dd className="font-mono text-xs mt-0.5">{typedOrder.paystack_reference}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Design file</h2>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-sm">{typedOrder.file_name}</p>
                {typedOrder.file_size && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {(typedOrder.file_size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
              </div>
              <a
                href={typedOrder.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold bg-teal text-white hover:bg-teal-light transition-colors"
              >
                Download
              </a>
            </div>
          </section>

          {typedOrder.internal_notes && (
            <section className="bg-amber-50 rounded-2xl border border-amber-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-2">Internal notes</h2>
              <p className="text-sm text-gray-700">{typedOrder.internal_notes}</p>
            </section>
          )}

          <OrderTimeline history={typedHistory} />
        </div>

        <div>
          <StatusActionPanel order={typedOrder} />
        </div>
      </div>
    </div>
  )
}
