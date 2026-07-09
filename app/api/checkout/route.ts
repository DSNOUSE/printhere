import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      customerName,
      customerEmail,
      productId,
      productName,
      quantity,
      unitPrice,
      notes,
      fileUrl,
      fileName,
      fileSize,
    } = body

    if (!customerName || !customerEmail || !productId || !productName || !quantity || !unitPrice || !fileUrl || !fileName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const totalPrice = unitPrice * quantity

    // Create order in Supabase
    const { data: order, error: dbError } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_name: customerName,
        customer_email: customerEmail,
        product_id: productId,
        product_name: productName,
        quantity,
        unit_price: unitPrice,
        total_price: totalPrice,
        notes: notes || null,
        file_url: fileUrl,
        file_name: fileName,
        file_size: fileSize || null,
        status: 'pending_payment',
      })
      .select()
      .single()

    if (dbError || !order) {
      console.error('Supabase error:', dbError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerEmail,
      metadata: {
        order_id: order.id,
      },
      line_items: [
        {
          price_data: {
            currency: 'ngn',
            product_data: {
              name: productName,
              description: `Qty: ${quantity}`,
            },
            unit_amount: Math.round(unitPrice * 100), // Stripe expects amount in kobo
          },
          quantity,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin}/order?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin}/order?cancelled=true`,
    })

    // Store Stripe session ID on the order
    await supabaseAdmin
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id)

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
