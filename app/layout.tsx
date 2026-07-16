import type { Metadata } from 'next'
import { Albert_Sans } from 'next/font/google'
import './globals.css'
import { SiteChrome } from '@/components/layout/SiteChrome'

const albertSans = Albert_Sans({ subsets: ['latin'], variable: '--font-albert-sans' })

export const metadata: Metadata = {
  title: 'PrintHere — Professional Design & Printing Services',
  description: 'Quality design and printing services delivered across Nigeria. Business cards, flyers, banners, posters, booklets and more.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={albertSans.variable}>
      <body className={`${albertSans.className} bg-cream`}>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  )
}
