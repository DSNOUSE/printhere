import { Resend } from 'resend'
import type { Order } from './supabase'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmation(order: Order) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: order.customer_email,
    subject: `Order confirmed — ${order.product_name} (#${order.id.slice(0, 8).toUpperCase()})`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 24px; margin-bottom: 8px;">Order Confirmed</h1>
        <p style="color: #666; margin-bottom: 32px;">
          Thanks ${order.customer_name}, your order has been received and payment confirmed.
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
          <tr style="background: #f5f5f5;">
            <td style="padding: 12px; font-weight: bold;">Order ID</td>
            <td style="padding: 12px;">#${order.id.slice(0, 8).toUpperCase()}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold;">Product</td>
            <td style="padding: 12px;">${order.product_name}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 12px; font-weight: bold;">Quantity</td>
            <td style="padding: 12px;">${order.quantity}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold;">File</td>
            <td style="padding: 12px;">${order.file_name}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 12px; font-weight: bold;">Total Paid</td>
            <td style="padding: 12px; font-weight: bold;">₦${order.total_price.toFixed(2)}</td>
          </tr>
        </table>

        <p style="color: #666; font-size: 14px;">
          We'll be in touch once your order is in production. 
          If you have any questions, reply to this email.
        </p>
      </div>
    `,
  })
}

export async function sendOrderStatusUpdate(order: Order, message: string) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: order.customer_email,
    subject: `Order update — #${order.id.slice(0, 8).toUpperCase()}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px;">
        <h1 style="font-size: 24px; margin-bottom: 8px;">Order Update</h1>
        <p style="color: #666;">${message}</p>
        <p style="margin-top: 24px; color: #666; font-size: 14px;">
          Order: <strong>#${order.id.slice(0, 8).toUpperCase()}</strong> — ${order.product_name}
        </p>
      </div>
    `,
  })
}
