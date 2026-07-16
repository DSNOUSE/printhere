import { NextRequest, NextResponse } from 'next/server'
import { requireStaffApi } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'
import { sendOrderStatusUpdate } from '@/lib/email'
import { canTransition, defaultStatusMessage, type OrderStatus } from '@/lib/orders'
import type { Order } from '@/lib/supabase'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const auth = await requireStaffApi()
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { id } = await params
  const body = await req.json()
  const { status, message, notifyCustomer, internalNotes } = body as {
    status: OrderStatus
    message?: string
    notifyCustomer?: boolean
    internalNotes?: string
  }

  if (!status) {
    return NextResponse.json({ error: 'Status is required' }, { status: 400 })
  }

  const { data: order, error: fetchError } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  if (!canTransition(order.status, status)) {
    return NextResponse.json(
      { error: `Cannot transition from ${order.status} to ${status}` },
      { status: 400 }
    )
  }

  const customerMessage = message?.trim() || defaultStatusMessage(status)

  const { data: updated, error: updateError } = await supabaseAdmin
    .from('orders')
    .update({
      status,
      internal_notes: internalNotes ?? order.internal_notes,
    })
    .eq('id', id)
    .select()
    .single()

  if (updateError || !updated) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }

  await supabaseAdmin.from('order_status_history').insert({
    order_id: id,
    from_status: order.status,
    to_status: status,
    changed_by: auth.profile.id,
    note: customerMessage,
  })

  if (notifyCustomer) {
    try {
      await sendOrderStatusUpdate(updated as Order, customerMessage)
    } catch {
      // Status updated; email failure should not roll back
    }
  }

  return NextResponse.json({ order: updated })
}
