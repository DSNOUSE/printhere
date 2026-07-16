import type { OrderStatusHistory } from '@/lib/supabase'
import { statusLabel } from '@/lib/orders'

type Props = {
  history: OrderStatusHistory[]
}

export function OrderTimeline({ history }: Props) {
  if (history.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-border p-6">
        <h2 className="font-semibold text-gray-900 mb-2">Timeline</h2>
        <p className="text-sm text-gray-500">No status changes recorded yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <h2 className="font-semibold text-gray-900 mb-4">Timeline</h2>
      <ol className="space-y-4">
        {history.map((entry) => (
          <li key={entry.id} className="flex gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-teal mt-1.5 shrink-0" />
            <div>
              <p className="font-medium text-gray-900">
                {entry.from_status
                  ? `${statusLabel(entry.from_status)} → ${statusLabel(entry.to_status)}`
                  : statusLabel(entry.to_status)}
              </p>
              {entry.note && <p className="text-gray-500 mt-0.5">{entry.note}</p>}
              <p className="text-xs text-gray-400 mt-1">
                {new Date(entry.created_at).toLocaleString('en-NG')}
                {entry.profiles?.full_name && ` · ${entry.profiles.full_name}`}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
