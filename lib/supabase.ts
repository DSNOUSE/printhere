import { createClient } from '@supabase/supabase-js'

// Client-side Supabase client (anon key, safe for browser)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  display_order: number
  active: boolean
}

export type Product = {
  id: string
  name: string
  description: string
  base_price: number
  turnaround_days: number
  accepted_formats: string[]
  active: boolean
  category_id: string | null
  slug: string
  image_url: string | null
  categories?: Category
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
  notes: string | null
  internal_notes: string | null
  file_url: string
  file_name: string
  file_size: number | null
  status: string
  paystack_reference: string | null
  created_at: string
  updated_at: string
}

export type Profile = {
  id: string
  email: string
  full_name: string | null
  role: 'admin' | 'staff'
  active: boolean
  created_at: string
}

export type OrderStatusHistory = {
  id: string
  order_id: string
  from_status: string | null
  to_status: string
  changed_by: string | null
  note: string | null
  created_at: string
  profiles?: { full_name: string | null; email: string } | null
}
