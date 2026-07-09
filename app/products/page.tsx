import { Container } from '@/components/shared/Container'
import { ProductCard } from '@/components/products/ProductCard'
import { supabase, type Product } from '@/lib/supabase'

export const revalidate = 60

export default async function ProductsPage() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('base_price', { ascending: true })

  return (
    <section className="py-16">
      <Container>
        {/* Page header */}
        <div className="max-w-2xl mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Our Products
          </h1>
          <p className="mt-3 text-gray-500 leading-relaxed">
            Premium printing for every need. Choose a product below to get started with your order.
          </p>
        </div>

        {/* Product grid */}
        {products?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400">No products available right now. Check back soon!</p>
          </div>
        )}
      </Container>
    </section>
  )
}
