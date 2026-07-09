import type { Metadata } from 'next'
import { Albert_Sans } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const albertSans = Albert_Sans({ subsets: ['latin'], variable: '--font-albert-sans' })

export const metadata: Metadata = {
  title: 'PrintHere — Professional Design & Printing Services',
  description: 'Quality design and printing services delivered across Nigeria. Business cards, flyers, banners, posters, booklets and more.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={albertSans.variable}>
      <body className={`${albertSans.className} bg-cream`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
