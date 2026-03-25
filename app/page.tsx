'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const bgImages = [
  '/images/art-two (17).jpeg',
  '/images/art-two (3).jpeg',
  '/images/art-two (38).jpeg',
  '/images/WhatsApp Image 2026-03-21 at 4.38.00 PM (2).jpeg',
  '/images/WhatsApp Image 2026-03-21 at 4.38.01 PM.jpeg',
]

export default function ComingSoonPage() {
  const [current, setCurrent] = useState(0)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  // 7 days from first mount
  const [launchDate] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('printhere-launch')
      if (stored) return new Date(stored)
      const date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      localStorage.setItem('printhere-launch', date.toISOString())
      return date
    }
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  })

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, launchDate.getTime() - Date.now())
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [launchDate])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bgImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <main className="relative min-h-screen bg-gray-950 text-white flex flex-col overflow-hidden">
      {/* Background slideshow */}
      {bgImages.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === current ? 0.4 : 0 }}
        >
          <Image
            src={src}
            alt="Print shop portfolio"
            fill
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Nav / Logo */}
        <header className="w-full px-6 py-6 md:px-12">
          <Image
            src="/images/logo.png"
            alt="PrintHere logo"
            width={220}
            height={64}
            priority
          />
        </header>

        {/* Hero */}
        <section className="flex-1 flex items-center justify-center px-6 md:px-12 pb-16">
          <div className="max-w-2xl text-center space-y-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-white/80">
              Coming Soon
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white">
              Your Prints,{' '}
              <span className="text-white">Delivered.</span>
            </h1>

            {/* Countdown timer */}
            <div className="flex justify-center gap-3 sm:gap-5 my-8">
              {[
                { value: timeLeft.days, label: 'Days' },
                { value: timeLeft.hours, label: 'Hours' },
                { value: timeLeft.minutes, label: 'Minutes' },
                { value: timeLeft.seconds, label: 'Seconds' },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="absolute -inset-1 rounded-2xl bg-white/10 blur-lg group-hover:bg-white/20 transition-all" />
                    <div className="relative w-20 h-24 sm:w-28 sm:h-32 rounded-2xl bg-white/5 border border-white/20 backdrop-blur-md flex items-center justify-center">
                      <span className="text-4xl sm:text-6xl font-extrabold tabular-nums text-white drop-shadow-lg">
                        {String(value).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                  <span className="mt-2 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/60">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-white/80 text-lg leading-relaxed">
              We&rsquo;re building the easiest way to order high-quality prints
              online. <br />Upload your design, pick your product, and we handle the
              rest, from production to your doorstep.
            </p>

            {/* Email signup */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 mt-4 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-xl bg-white/10 border border-white/30 px-5 py-3 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/60 backdrop-blur-sm"
              />
              <button
                type="submit"
                className="rounded-xl bg-white text-black px-6 py-3 text-sm font-semibold hover:bg-white/90 transition-colors"
              >
                Notify Me
              </button>
            </form>
            <p className="text-xs text-white/50">
              We&rsquo;ll only email you when we launch. No spam.
            </p>
          </div>
        </section>

        {/* Slide indicators */}
        <div className="flex justify-center gap-2 pb-4">
          {bgImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current ? 'bg-white w-6' : 'bg-white/40'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-white/50 py-6">
          &copy; {new Date().getFullYear()} PrintHere. All rights reserved.
        </footer>
      </div>
    </main>
  )
}
