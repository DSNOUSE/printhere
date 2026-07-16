import Link from 'next/link'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { statusLabel } from '@/lib/orders'

type StatCard = {
  label: string
  count: number
  status: string
  href: string
}

type Props = {
  stats: StatCard[]
}

export function DashboardStats({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Link
          key={stat.status}
          href={stat.href}
          className="bg-white rounded-2xl border border-border p-5 hover:border-teal/30 hover:shadow-sm transition-all"
        >
          <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
          <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          <div className="mt-3">
            <StatusBadge status={stat.status} />
          </div>
        </Link>
      ))}
    </div>
  )
}

export function StatusFilterTabs({
  current,
  counts,
}: {
  current?: string
  counts: Record<string, number>
}) {
  const tabs = [
    { value: '', label: 'All' },
    { value: 'paid', label: 'Paid' },
    { value: 'in_production', label: 'In Production' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const active = (current ?? '') === tab.value
        const count = tab.value ? (counts[tab.value] ?? 0) : Object.values(counts).reduce((a, b) => a + b, 0)

        return (
          <Link
            key={tab.value}
            href={tab.value ? `/admin/orders?status=${tab.value}` : '/admin/orders'}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              active
                ? 'bg-teal text-white'
                : 'bg-white border border-border text-gray-600 hover:border-teal/30'
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 ${active ? 'text-white/70' : 'text-gray-400'}`}>
              ({count})
            </span>
          </Link>
        )
      })}
    </div>
  )
}
