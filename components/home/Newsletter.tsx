'use client'

import { Container } from '@/components/shared/Container'
import { Button } from '@/components/shared/Button'

export function Newsletter() {
  return (
    <section className="py-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-teal px-6 py-16 sm:px-12 sm:py-20 text-center">
          {/* Decorative elements */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/5" />
          </div>

          <div className="relative max-w-lg mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Stay in the Loop
            </h2>
            <p className="text-white/70 mb-8">
              Get updates on new products, special offers, and printing tips delivered to your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <Button type="submit" variant="ghost">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  )
}
