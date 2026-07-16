import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/shared/Container'
import { Button } from '@/components/shared/Button'
import { supabase } from '@/lib/supabase'

const categoryImages: Record<string, string> = {
  'Business Cards': '/images/art-two-3.jpg',
  'Flyers & Leaflets': '/images/art-two-17.jpg',
  'Posters & Banners': '/images/operator-printer.jpg',
  'Booklets & Brochures': '/images/booklets-brochures.jpg',
  'Large Format': '/images/operator-printer-v1.jpg',
  'Stationery': '/images/stationery.jpg',
}

export async function CategoryGrid() {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('active', true)
    .order('display_order', { ascending: true })

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
          {categories?.map((category) => (
            <Link
              key={category.id}
              href={`/products/${category.slug}`}
              className="group"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-teal/5">
                <Image
                  src={categoryImages[category.name] || '/images/art-two-38.jpg'}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <p className="text-lg font-bold text-white group-hover:scale-110 transition-transform duration-300">
                    {category.name}
                  </p>
                  <p className="text-sm text-gray-200 mt-1">{category.description}</p>
                </div>
              </div>
              <p className="mt-3 text-base font-semibold text-teal flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                Shop {category.name}
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
