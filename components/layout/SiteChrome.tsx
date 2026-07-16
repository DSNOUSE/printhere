'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isStaffArea = pathname.startsWith('/admin') || pathname.startsWith('/staff')

  if (isStaffArea) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
