import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { sendOrderConfirmation } from '@/lib/email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const orderId = session.metadata?.order_id

      if (orderId) {
        // Update order status
        const { error: updateError } = await supabaseAdmin
          .from('orders')
          .update({
            status: 'paid',
            stripe_payment_intent: session.payment_intent as string,
          })
          .eq('id', orderId)

        if (updateError) {
          console.error('Failed to update order:', updateError)
          break
        }

        // Fetch order and send confirmation email
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
      break
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session
      const orderId = session.metadata?.order_id

      if (orderId) {
        await supabaseAdmin
          .from('orders')
          .update({ status: 'cancelled' })
          .eq('id', orderId)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
