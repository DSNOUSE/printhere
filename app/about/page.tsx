import Image from 'next/image'
import { Container } from '@/components/shared/Container'
import { Button } from '@/components/shared/Button'

const values = [
  {
    title: 'Premium Quality',
    description: 'We use only the finest paper stocks and inks to ensure your prints look sharp, vibrant, and professional every time.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    title: 'Fast Turnaround',
    description: 'Most orders are completed in 3–7 working days. Need it sooner? Contact us for rush options.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'Customer Focus',
    description: 'Your satisfaction is everything. We work with you every step of the way to make sure you love your prints.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    title: 'Nationwide Delivery',
    description: 'We deliver to every state in Nigeria. Your prints arrive safely packaged and on time.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-lg">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                We bring your ideas <span className="text-teal">to life</span>
              </h1>
              <p className="mt-5 text-gray-500 leading-relaxed text-lg">
                PrintHere is a professional design and printing service based in Nigeria. We help businesses, creatives, and individuals turn their designs into stunning prints — fast, affordable, and hassle-free.
              </p>
              <div className="mt-8">
                <Button href="/products" size="lg">
                  Explore Products
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-teal/5 rotate-2" />
                <Image
                  src="/images/operator-printer.jpg"
                  alt="Printing production"
                  width={520}
                  height={400}
                  className="relative rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              To make professional printing accessible to everyone in Nigeria. Whether you&apos;re a startup ordering your first business cards or an established brand refreshing your marketing materials — we deliver the same premium quality, every time.
            </p>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-20">
        <Container>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">
            Why Choose PrintHere
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="bg-white rounded-2xl border border-border p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-teal/10 text-teal flex items-center justify-center mb-4">
                  {v.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">{v.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 bg-teal">
        <Container className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Ready to get started?
          </h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Browse our product catalog or get in touch for custom orders and bulk pricing.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button href="/products" className="bg-white text-teal hover:bg-white/90" size="lg">
              Browse Products
            </Button>
            <Button href="/contact" variant="outline" className="border-white text-white hover:bg-white/10" size="lg">
              Contact Us
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}
