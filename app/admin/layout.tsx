import { requireStaff } from '@/lib/auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireStaff()

  return (
    <div className="min-h-screen bg-cream flex">
      <AdminSidebar profile={profile} />
      <div className="flex-1 min-w-0">
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
