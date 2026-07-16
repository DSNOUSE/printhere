'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/shared/Button'
import { Container } from '@/components/shared/Container'
import { LoginPopup } from '@/components/layout/LoginPopup'
import { supabase } from '@/lib/supabase'

interface ProductLite {
  id: string
  name: string
}

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [products, setProducts] = useState<ProductLite[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase
      .from('products')
      .select('id, name')
      .eq('active', true)
      .order('name')
      .then(({ data }) => {
        if (data) setProducts(data as ProductLite[])
      })
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      {/* Top bar - Utility links */}
      <div className="bg-gray-900 text-xs relative z-[60]">
        <Container>
          <div className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-4">
              <span className="text-gray-300">
                🇳🇬 <span className="text-white font-medium">Nigeria</span>
              </span>
              <Link href="/sample-pack" className="hidden sm:inline-flex items-center gap-1.5 text-white hover:text-teal transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Free Sample Pack
              </Link>
              <span className="hidden lg:inline text-gray-400">
                Free delivery on orders over ₦50,000
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/help" className="text-gray-300 hover:text-white transition-colors">
                Help & FAQs
              </Link>
              <LoginPopup trigger="button" />
            </div>
          </div>
        </Container>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-cream/90 backdrop-blur-md shadow-sm'
            : 'bg-cream'
        }`}
      >
        <Container>
          <div className="flex items-center justify-between h-16 sm:h-20 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="PrintHere"
                width={140}
                height={40}
                className="h-8 sm:h-10 w-auto"
                priority
              />
            </Link>

            {/* Search bar - desktop */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="search"
                  placeholder="Search business cards, flyers..."
                  className="w-full pl-4 pr-10 py-2.5 rounded-full border-2 border-gray-200 focus:border-teal focus:outline-none text-sm"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {/* Products mega menu */}
              <div ref={dropdownRef} className="relative">
                <button
                  onMouseEnter={() => setProductsOpen(true)}
                  className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-teal transition-colors"
                >
                  Products
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {productsOpen && (
                  <div
                    onMouseLeave={() => setProductsOpen(false)}
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-4 animate-fade-in"
                  >
                    <div className="bg-white rounded-2xl shadow-2xl border border-border p-8 min-w-[600px]">
                      <div className="grid grid-cols-3 gap-6">
                        {products.slice(0, 6).map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            onClick={() => setProductsOpen(false)}
                            className="group flex items-center gap-3 p-3 rounded-xl hover:bg-teal/5 transition-colors"
                          >
                            <div className="w-12 h-12 rounded-lg bg-teal/10 flex items-center justify-center text-teal group-hover:bg-teal group-hover:text-white transition-colors">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 group-hover:text-teal transition-colors">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">Starting from ₦{(Math.random() * 50000 + 10000).toFixed(0)}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:gap-3 transition-all">
                          View all products
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/business-services" className="text-sm font-semibold text-gray-700 hover:text-teal transition-colors">
                Business Services
              </Link>

              <Link href="/blog" className="text-sm font-semibold text-gray-700 hover:text-teal transition-colors">
                Blog
              </Link>

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-gray-700 hover:text-teal transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/cart" className="relative p-2 text-gray-700 hover:text-teal transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-magenta text-white text-[10px] font-bold rounded-full flex items-center justify-center">0</span>
              </Link>
              <Button href="/order" size="sm" variant="magenta">
                Order Now
              </Button>
            </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-teal transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-border pb-4 animate-fade-in">
            <nav className="flex flex-col gap-1 pt-3">
              {/* Mobile Products accordion */}
              <div className="px-3 py-2.5">
                <button
                  onClick={() => setProductsOpen(!productsOpen)}
                  className="flex items-center justify-between w-full text-sm font-semibold text-gray-700"
                >
                  Products
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      productsOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {productsOpen && (
                  <div className="mt-3 space-y-1 pl-2">
                    {products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        onClick={() => setMenuOpen(false)}
                        className="block text-sm text-gray-500 hover:text-teal transition-colors"
                      >
                        {product.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2.5 text-sm font-semibold text-gray-700 hover:text-teal hover:bg-teal/5 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-3 pt-2 space-y-2">
                <Button href="/order" size="sm" className="w-full">
                  Order Now
                </Button>
              </div>
            </nav>
          </div>
        )}
      </Container>
    </header>

    </>
  )
}
