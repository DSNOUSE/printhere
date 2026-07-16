'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import type { Profile } from '@/lib/supabase'

type Props = {
  profile: Profile
}

const navItems = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/orders', label: 'Orders', exact: false },
]

export function AdminSidebar({ profile }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/staff/login')
    router.refresh()
  }

  return (
    <aside className="w-64 shrink-0 bg-teal text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="text-lg font-bold">
          PrintHere
        </Link>
        <p className="text-xs text-white/60 mt-1">Admin</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-white/60 truncate px-2">{profile.full_name ?? profile.email}</p>
        <p className="text-xs text-white/40 capitalize px-2 mb-3">{profile.role}</p>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
