'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/shared/Button'
import { Container } from '@/components/shared/Container'
import { productCategories } from '@/lib/product-categories'
import { LoginModal } from '@/components/layout/LoginModal'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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
      {/* Top bar */}
      <div className="bg-[#8B008B] text-xs">;
        <Container>
          <div className="flex items-center justify-between py-2">
            <p className="text-white">
              A subsidiary of <span className="font-bold text-white">NRS (New Revolution Source)</span>
            </p>
            <p className="hidden sm:block text-white">
              Free delivery on orders over ₦50,000
            </p>
          </div>
        </Container>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-cream/90 backdrop-blur-md shadow-sm'
            : 'bg-cream'
        }`}
      >
      <Container>
        <div className="flex items-center justify-between h-16 sm:h-20">
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

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-semibold text-gray-700 hover:text-teal transition-colors"
            >
              Home
            </Link>

            {/* Products dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setProductsOpen(!productsOpen)}
                onMouseEnter={() => setProductsOpen(true)}
                className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-teal transition-colors"
              >
                Products
                <svg
                  className={`w-3.5 h-3.5 mt-0.5 transition-transform duration-200 ${
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
                <div
                  onMouseLeave={() => setProductsOpen(false)}
                  className="absolute left-1/2 -translate-x-1/2 top-full pt-3 animate-fade-in"
                >
                  <div className="bg-white rounded-2xl shadow-xl border border-border p-6 grid grid-cols-3 gap-x-8 gap-y-6 min-w-[600px]">
                    {productCategories.map((category) => (
                      <div key={category.href}>
                        <Link
                          href={category.href}
                          onClick={() => setProductsOpen(false)}
                          className="text-sm font-bold text-gray-900 hover:text-teal transition-colors"
                        >
                          {category.label}
                        </Link>
                        <ul className="mt-2 space-y-1">
                          {category.items.map((item) => (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                onClick={() => setProductsOpen(false)}
                                className="text-sm text-gray-500 hover:text-teal hover:underline transition-colors"
                              >
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

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
          <div className="hidden md:flex items-center gap-3">
            <Button onClick={() => setLoginOpen(true)} variant="ghost" size="sm">
              Log in
            </Button>
            <Button href="/order" size="sm">
              Order Now
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-teal transition-colors"
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
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 text-sm font-semibold text-gray-700 hover:text-teal hover:bg-teal/5 rounded-lg transition-colors"
              >
                Home
              </Link>

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
                  <div className="mt-3 space-y-4 pl-2">
                    {productCategories.map((category) => (
                      <div key={category.href}>
                        <Link
                          href={category.href}
                          onClick={() => setMenuOpen(false)}
                          className="text-sm font-bold text-gray-900 hover:text-teal transition-colors"
                        >
                          {category.label}
                        </Link>
                        <ul className="mt-1.5 space-y-1 ml-2">
                          {category.items.map((item) => (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                onClick={() => setMenuOpen(false)}
                                className="text-sm text-gray-500 hover:text-teal transition-colors"
                              >
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
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
                <Button onClick={() => { setLoginOpen(true); setMenuOpen(false) }} variant="ghost" size="sm" className="w-full">
                  Log in
                </Button>
                <Button href="/order" size="sm" className="w-full">
                  Order Now
                </Button>
              </div>
            </nav>
          </div>
        )}
      </Container>
    </header>

      {/* Login Modal */}
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  )
}
