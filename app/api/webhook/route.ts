import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'
import { sendOrderConfirmation } from '@/lib/email'

export const runtime = 'nodejs'

type PaystackEvent = {
  event?: string
  data?: { reference?: string; metadata?: { order_id?: string } }
}

// Verifies the Paystack webhook signature and fulfils paid orders idempotently.
export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-paystack-signature')
  const secret = process.env.PAYSTACK_SECRET_KEY

  if (!secret) {
    console.error('Missing PAYSTACK_SECRET_KEY')
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }

  const expected = crypto.createHmac('sha512', secret).update(rawBody).digest('hex')
  if (!signature || expected !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let event: PaystackEvent
  try {
    event = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  if (event.event === 'charge.success') {
    const orderId = event.data?.metadata?.order_id || event.data?.reference

    if (orderId) {
      // Idempotency: only fulfil an order once.
      const { data: existing } = await supabaseAdmin
        .from('orders')
        .select('id, status')
        .eq('id', orderId)
        .single()

      if (existing && existing.status !== 'paid') {
        const { error: updateError } = await supabaseAdmin
          .from('orders')
          .update({ 
            status: 'paid',
            paystack_reference: event.data?.reference || existing.id
          })
          .eq('id', orderId)

        if (updateError) {
          console.error('Failed to update order:', updateError)
        } else {
          const { data: order } = await supabaseAdmin
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single()

          if (order) {
            try {
              await sendOrderConfirmation(order)
            } catch (emailErr) {
              console.error('Failed to send confirmation email:', emailErr)
            }
          }
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
