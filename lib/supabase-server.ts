import { createClient } from '@supabase/supabase-js'

// Server-side client with elevated permissions (use only in API routes)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)