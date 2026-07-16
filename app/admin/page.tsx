import { supabaseAdmin } from '@/lib/supabase-server'
import { DashboardStats } from '@/components/admin/DashboardStats'
import { OrderTable } from '@/components/admin/OrderTable'
import Link from 'next/link'

async function getStats() {
  const statuses = ['paid', 'in_production', 'shipped', 'completed'] as const
  const counts: Record<string, number> = {}

  await Promise.all(
    statuses.map(async (status) => {
      const { count } = await supabaseAdmin
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', status)
      counts[status] = count ?? 0
    })
  )

  return counts
}

export default async function AdminDashboardPage() {
  const counts = await getStats()

  const stats = [
    { label: 'Awaiting production', count: counts.paid, status: 'paid', href: '/admin/orders?status=paid' },
    { label: 'In production', count: counts.in_production, status: 'in_production', href: '/admin/orders?status=in_production' },
    { label: 'Shipped', count: counts.shipped, status: 'shipped', href: '/admin/orders?status=shipped' },
    { label: 'Completed', count: counts.completed, status: 'completed', href: '/admin/orders?status=completed' },
  ]

  const { data: recentOrders } = await supabaseAdmin
    .from('orders')
    .select('*')
    .in('status', ['paid', 'in_production'])
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Order fulfilment overview</p>
        </div>
        <Link
          href="/admin/orders"
          className="text-sm font-semibold text-teal hover:underline"
        >
          View all orders →
        </Link>
      </div>

      <DashboardStats stats={stats} />

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Needs attention</h2>
        <OrderTable orders={recentOrders ?? []} />
      </div>
    </div>
  )
}
