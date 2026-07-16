import { NextRequest, NextResponse } from 'next/server'
import { requireStaffApi } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const auth = await requireStaffApi()
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const { id } = await params

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const { data: history } = await supabaseAdmin
    .from('order_status_history')
    .select('*, profiles(full_name, email)')
    .eq('order_id', id)
    .order('created_at', { ascending: false })

  return NextResponse.json({ order, history: history ?? [] })
}
