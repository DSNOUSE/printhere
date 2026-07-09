import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/shared/Container'
import { Button } from '@/components/shared/Button'
import { productCategories } from '@/lib/product-categories'
import { ProductCard } from './ProductCard'

const categoryImages: Record<string, string> = {
  'Business Cards': '/images/art-two-3.jpg',
  'Flyers & Leaflets': '/images/art-two-17.jpg',
  'Posters & Banners': '/images/operator-printer.jpg',
  'Booklets & Brochures': '/images/booklets-brochures.jpg',
  'Large Format': '/images/operator-printer-v1.jpg',
  'Stationery': '/images/stationery.jpg',
}

type Props = {
  categorySlug?: string
  subcategorySlug?: string
}

export function CategoryGrid({ categorySlug, subcategorySlug }: Props) {
  // If viewing a specific category
  if (categorySlug && !subcategorySlug) {
    const category = productCategories.find(c => c.href.endsWith(categorySlug))
    if (!category) return null

    return (
      <section className="py-20">
        <Container>
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {category.label}
            </h2>
            <p className="mt-3 text-gray-500">
              Choose from our range of {category.label.toLowerCase()}.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.items.map(item => (
              <Link
                key={item.href}
                href={`/products/${item.href.split('/').pop()}`}
                className="group bg-white rounded-2xl border border-border p-6 hover:border-teal/30 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="font-semibold text-gray-900 group-hover:text-teal transition-colors">
                  {item.label}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Starting from competitive prices
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    )
  }

  // If viewing a subcategory
  if (categorySlug && subcategorySlug) {
    const category = productCategories.find(c => c.href.endsWith(categorySlug))
    if (!category) return null

    const subcategory = category.items.find(item => item.href.endsWith(subcategorySlug))
    if (!subcategory) return null

    return (
      <section className="py-20">
        <Container>
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {subcategory.label}
            </h2>
            <p className="mt-3 text-gray-500">
              Browse our range of {subcategory.label.toLowerCase()} or get in touch for a custom quote.
            </p>
          </div>
          <div className="text-center py-20">
            <p className="text-gray-400 mb-4">Product pricing and specifications coming soon.</p>
            <Button href="/order" size="lg">Order Now</Button>
          </div>
        </Container>
      </section>
    )
  }

  // Default: show all categories
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
          {productCategories.map(cat => (
            <Link
              key={cat.href}
              href={`/products/${cat.href.split('/').pop()}`}
              className="group"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-teal/5">
                <Image
                  src={categoryImages[cat.label] || '/images/art-two-38.jpg'}
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