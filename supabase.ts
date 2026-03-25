import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Server-side client with elevated permissions (use only in API routes)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export type Product = {
  id: string
  name: string
  description: string
  base_price: number
  turnaround_days: number
  accepted_formats: string[]
  active: boolean
}

export type Order = {
  id: string
  customer_name: string
  customer_email: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total_price: number
  notes: string
  file_url: string
  file_name: string
  file_size: number
  status: string
  stripe_session_id: string
  created_at: string
}
