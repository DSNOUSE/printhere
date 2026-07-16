import { NextRequest, NextResponse } from 'next/server'
import { requireStaffApi } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const auth = await requireStaffApi()
  if ('error' in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const status = req.nextUrl.searchParams.get('status')
  const search = req.nextUrl.searchParams.get('search')

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

  const { data: orders, error } = await query

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }

  return NextResponse.json({ orders })
}
