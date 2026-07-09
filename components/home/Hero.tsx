import Image from 'next/image'
import { Container } from '@/components/shared/Container'
import { Button } from '@/components/shared/Button'

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-20 sm:pt-28 sm:pb-28 bg-white">
      {/* Decorative geometric shapes */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        <div className="absolute top-12 right-[10%] w-64 h-64 rounded-full border border-teal/10" />
        <div className="absolute top-32 right-[15%] w-40 h-40 rounded-full border border-teal/5" />
        <div className="absolute -bottom-8 left-[5%] w-80 h-80 rounded-full bg-teal/[0.03]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-teal/[0.04] to-transparent" />
      </div>

      <Container className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight animate-fade-in animate-delay-100">
              Design.
              <br />
              Print.
              <br />
              <span className="text-teal">Deliver.</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed animate-fade-in animate-delay-200">
              From business cards to large format prints — premium quality, fast turnaround, and delivered right to your doorstep across Nigeria.
            </p>
            <div className="flex flex-wrap gap-3 mt-8 animate-fade-in animate-delay-300">
              <Button href="/products" size="lg">
                Browse Products
              </Button>
              <Button href="/contact" variant="outline" size="lg">
                Get a Quote
              </Button>
            </div>
          </div>

          {/* Hero image */}
          <div className="hidden lg:flex justify-center animate-fade-in animate-delay-200">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-teal/5 -rotate-3" />
              <Image
                src="/images/main-landing.png"
                alt="Professional printing services"
                width={520}
                height={480}
                className="relative rounded-2xl object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
