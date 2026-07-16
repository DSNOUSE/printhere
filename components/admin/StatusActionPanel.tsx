'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Order } from '@/lib/supabase'
import { Button } from '@/components/shared/Button'
import {
  defaultStatusMessage,
  getNextStatuses,
  statusLabel,
  type OrderStatus,
} from '@/lib/orders'

type Props = {
  order: Order
}

export function StatusActionPanel({ order }: Props) {
  const router = useRouter()
  const nextStatuses = getNextStatuses(order.status)
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>(
    nextStatuses[0] ?? ''
  )
  const [message, setMessage] = useState(
    nextStatuses[0] ? defaultStatusMessage(nextStatuses[0]) : ''
  )
  const [internalNotes, setInternalNotes] = useState(order.internal_notes ?? '')
  const [notifyCustomer, setNotifyCustomer] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleStatusChange(status: OrderStatus) {
    setSelectedStatus(status)
    setMessage(defaultStatusMessage(status))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedStatus) return

    setLoading(true)
    setError('')

    const res = await fetch(`/api/admin/orders/${order.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: selectedStatus,
        message,
        notifyCustomer,
        internalNotes,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Failed to update status')
      setLoading(false)
      return
    }

    router.refresh()
    setLoading(false)
  }

  if (nextStatuses.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-border p-6">
        <h2 className="font-semibold text-gray-900 mb-2">Actions</h2>
        <p className="text-sm text-gray-500">No further status changes available for this order.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-6">
      <h2 className="font-semibold text-gray-900 mb-4">Update Status</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New status</label>
          <select
            value={selectedStatus}
            onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
            className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-teal/50"
          >
            {nextStatuses.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-teal/50 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Internal notes</label>
          <textarea
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            rows={2}
            placeholder="Staff-only notes (not sent to customer)"
            className="w-full px-4 py-2.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-teal/50 resize-none"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={notifyCustomer}
            onChange={(e) => setNotifyCustomer(e.target.checked)}
            className="rounded border-border text-teal focus:ring-teal/50"
          />
          Email customer about this update
        </label>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2">
            {error}
          </p>
        )}

        <Button type="submit" disabled={loading || !selectedStatus}>
          {loading ? 'Updating…' : 'Update order'}
        </Button>
      </form>
    </div>
  )
}
