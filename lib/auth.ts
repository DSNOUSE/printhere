import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server-client'
import { supabaseAdmin } from '@/lib/supabase-server'
import type { Profile } from '@/lib/supabase'

export async function getSessionUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getStaffProfile(): Promise<Profile | null> {
  const user = await getSessionUser()
  if (!user) return null

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .eq('active', true)
    .in('role', ['admin', 'staff'])
    .single()

  return profile as Profile | null
}

export async function requireStaff(): Promise<Profile> {
  const profile = await getStaffProfile()
  if (!profile) {
    redirect('/staff/login')
  }
  return profile
}

export async function requireStaffApi(): Promise<{ profile: Profile } | { error: string; status: number }> {
  const profile = await getStaffProfile()
  if (!profile) {
    return { error: 'Unauthorized', status: 401 }
  }
  return { profile }
}
