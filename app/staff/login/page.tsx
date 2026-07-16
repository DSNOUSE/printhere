import { Suspense } from 'react'
import { StaffLoginForm } from '@/components/staff/StaffLoginForm'

export default function StaffLoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <Suspense fallback={<p className="text-gray-500 text-sm">Loading…</p>}>
        <StaffLoginForm />
      </Suspense>
    </div>
  )
}
