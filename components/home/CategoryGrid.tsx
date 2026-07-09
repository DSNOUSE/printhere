import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/shared/Container'
import { Button } from '@/components/shared/Button'
import { productCategories } from '@/lib/product-categories'

const categoryImages: Record<string, string> = {
  'Business Cards': '/images/art-two (3).jpeg',
  'Flyers & Leaflets': '/images/art-two (17).jpeg',
  'Posters & Banners': '/images/operator-printer.jpg',
  'Booklets & Brochures': '/images/WhatsApp Image 2026-03-21 at 4.38.00 PM (2).jpeg',
  'Large Format': '/images/operator-printer-v1.jpg',
  'Stationery': '/images/WhatsApp Image 2026-03-21 at 4.38.01 PM.jpeg',
}

export function CategoryGrid() {
  return (
    <section className="py-20">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Explore Our Products
          </h2>
          <p className="mt-3 text-gray-500 max-w-lg mx-auto">
            Everything you need to make a great impression — from business essentials to large-format prints.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
          {productCategories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-teal/5">
                <Image
                  src={categoryImages[cat.label] || '/images/art-two (38).jpeg'}
                  alt={cat.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <p className="text-lg font-bold text-white group-hover:scale-110 transition-transform duration-300">
                    {cat.label}
                  </p>
                  <p className="text-sm text-gray-200 mt-1">{cat.items.length} options</p>
                </div>
              </div>
              <p className="mt-3 text-base font-semibold text-teal flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                Shop {cat.label}
                <span className="text-lg">›</span>
              </p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button href="/products" size="lg">
            View All Products
          </Button>
        </div>
      </Container>
    </section>
  )
}
