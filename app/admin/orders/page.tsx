import { supabaseAdmin } from '@/lib/supabase-server'
import { OrderTable } from '@/components/admin/OrderTable'
import { StatusFilterTabs } from '@/components/admin/DashboardStats'

type Props = {
  searchParams: Promise<{ status?: string; search?: string }>
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { status, search } = await searchParams

  let query = supabaseAdmin
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  if (search) {
    query = query.or(
      `customer_email.ilike.%${search}%,customer_name.ilike.%${search}%,id.ilike.%${search}%`
    )
  }

  const { data: orders } = await query

  const statuses = ['paid', 'in_production', 'shipped', 'completed', 'cancelled'] as const
  const counts: Record<string, number> = {}

  await Promise.all(
    statuses.map(async (s) => {
      const { count } = await supabaseAdmin
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', s)
      counts[s] = count ?? 0
    })
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">Manage and fulfil customer orders</p>
      </div>

      <StatusFilterTabs current={status} counts={counts} />

      <OrderTable orders={orders ?? []} />
    </div>
  )
}
