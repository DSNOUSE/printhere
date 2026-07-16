import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

// Returns limited order status for the post-payment confirmation screen.
// The reference is the order id (also used as the Paystack transaction reference).
export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get('reference')
  if (!reference) {
    return NextResponse.json({ error: 'Missing reference' }, { status: 400 })
  }

  const { data: order } = await supabaseAdmin
    .from('orders')
    .select('id, status, product_name, quantity, total_price')
    .eq('id', reference)
    .single()

  if (!order) {
    return NextResponse.json({ order: null }, { status: 404 })
  }

  return NextResponse.json({ order })
}
