import Link from 'next/link'
import { Container } from '@/components/shared/Container'
import { ProductCard } from '@/components/products/ProductCard'
import { supabase, type Product } from '@/lib/supabase'

export async function FeaturedProducts() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .limit(6)

  if (!products?.length) return null

  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Popular Products
            </h2>
            <p className="mt-3 text-gray-500">
              Our most requested print products — trusted by businesses across Nigeria.
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-teal hover:text-teal-light transition-colors"
          >
            View all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/products"
            className="text-sm font-semibold text-teal hover:text-teal-light transition-colors"
          >
            View all products →
          </Link>
        </div>
      </Container>
    </section>
  )
}
