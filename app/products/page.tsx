import { Container } from '@/components/shared/Container'
import { Button } from '@/components/shared/Button'
import Link from 'next/link'
import Image from 'next/image'
import { supabase, type Product, type Category } from '@/lib/supabase'

export const revalidate = 60

interface CategoryWithCount extends Category {
  product_count: number
}

export default async function ProductsPage() {
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('base_price', { ascending: true }),
    supabase
      .from('categories')
      .select('*, products(count)')
      .eq('active', true)
      .order('display_order', { ascending: true }),
  ])

  const categoriesWithCount: CategoryWithCount[] = categories?.map((cat: any) => ({
    ...cat,
    product_count: cat.products?.length || 0,
  })) || []

  return (
    <section className="py-16">
      <Container>
        {/* Page header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            All Products
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl">
            Explore our full range of premium printing services. From business cards to large-format prints, we've got you covered.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Categories</h3>
                <nav className="space-y-1">
                  <Button
                    href="/products"
                    variant="ghost"
                    className="w-full justify-start text-gray-700 hover:text-teal"
                  >
                    All Products
                    <span className="ml-auto text-xs text-gray-400">
                      {products?.length || 0}
                    </span>
                  </Button>
                  {categoriesWithCount.map((category) => (
                    <Button
                      key={category.id}
                      href={`/products/${category.slug}`}
                      variant="ghost"
                      className="w-full justify-start text-gray-700 hover:text-teal"
                    >
                      {category.name}
                      <span className="ml-auto text-xs text-gray-400">
                        {category.product_count}
                      </span>
                    </Button>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            {products?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product: Product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.category_id}/${product.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-teal/20 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-square bg-gray-50 flex items-center justify-center p-8">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          width={400}
                          height={400}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="text-gray-300">
                          <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-teal transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-teal">
                          ₦{product.base_price.toLocaleString()}
                        </p>
                        <span className="text-sm text-gray-500">
                          {product.turnaround_days} days
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-400">No products available right now. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
