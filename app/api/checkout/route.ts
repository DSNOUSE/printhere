import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

// Creates an order (with a server-computed price) and initializes a Paystack
// transaction. The order id is used as the Paystack reference so the webhook
// can reconcile without any extra database columns.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      customerName,
      customerEmail,
      productId,
      quantity,
      notes,
      fileUrl,
      fileName,
      fileSize,
    } = body

    // Presence + format validation
    if (!customerName?.trim() || !customerEmail?.trim() || !productId || !fileUrl || !fileName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }
    const qty = Math.floor(Number(quantity))
    if (!Number.isFinite(qty) || qty < 1 || qty > 100000) {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 })
    }

    if (!process.env.PAYSTACK_SECRET_KEY) {
      console.error('Missing PAYSTACK_SECRET_KEY')
      return NextResponse.json({ error: 'Payment is not configured' }, { status: 500 })
    }

    // Never trust a client-supplied price: look it up server-side.
    const { data: product, error: productErr } = await supabaseAdmin
      .from('products')
      .select('id, name, base_price, active')
      .eq('id', productId)
      .eq('active', true)
      .single()

    if (productErr || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const unitPrice = Number(product.base_price)
    const totalPrice = unitPrice * qty

    // Create the order with authoritative amounts.
    const { data: order, error: dbError } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_name: customerName,
        customer_email: customerEmail,
        product_id: product.id,
        product_name: product.name,
        quantity: qty,
        unit_price: unitPrice,
        total_price: totalPrice,
        notes: notes || null,
        file_url: fileUrl,
        file_name: fileName,
        file_size: fileSize || null,
        status: 'pending_payment',
        paystack_reference: null,
      })
      .select()
      .single()

    if (dbError || !order) {
      console.error('Supabase error:', dbError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // Initialize the Paystack transaction (amount in kobo).
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin
    const initRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: customerEmail,
        amount: Math.round(totalPrice * 100),
        currency: 'NGN',
        reference: order.id,
        metadata: { order_id: order.id, product_name: product.name, quantity: qty },
        callback_url: `${baseUrl}/order?reference=${order.id}`,
      }),
    })

    const initData = await initRes.json()

    if (!initRes.ok || !initData.status || !initData.data?.authorization_url) {
      console.error('Paystack init error:', initData)
      await supabaseAdmin.from('orders').update({ status: 'payment_failed' }).eq('id', order.id)
      return NextResponse.json({ error: 'Failed to initialize payment' }, { status: 502 })
    }

    // Store the Paystack reference (may differ from order id if Paystack normalizes it)
    await supabaseAdmin
      .from('orders')
      .update({ paystack_reference: initData.data.reference || order.id })
      .eq('id', order.id)

    return NextResponse.json({ url: initData.data.authorization_url })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
