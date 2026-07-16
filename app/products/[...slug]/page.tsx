import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/shared/Container'
import { Button } from '@/components/shared/Button'
import { supabase } from '@/lib/supabase'

type Props = {
  params: Promise<{ slug: string[] }>
}

export const revalidate = 60

export default async function ProductOrCategoryPage({ params }: Props) {
  const { slug } = await params
  const slugPath = slug.join('/')

  // Try to find a category by slug first
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slugPath)
    .eq('active', true)
    .single()

  if (category) {
    // Category page - show all products in this category
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', category.id)
      .eq('active', true)
      .order('base_price', { ascending: true })

    return (
      <section className="py-16">
        <Container>
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-10">
            <Link href="/" className="hover:text-teal transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-teal transition-colors">Products</Link>
            <span>/</span>
            <span className="text-gray-700">{category.name}</span>
          </nav>

          {/* Category header */}
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-lg text-gray-500 max-w-2xl">
                {category.description}
              </p>
            )}
          </div>

          {/* Products grid */}
          {products?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${category.slug}/${product.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-teal/20 hover:shadow-xl transition-all duration-300">
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
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400">No products available in this category yet.</p>
              <Button href="/products" className="mt-6">
                Browse All Products
              </Button>
            </div>
          )}
        </Container>
      </section>
    )
  }

  // Try to find product by slug within category
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slugPath)
    .eq('active', true)
    .single()

  if (!product) notFound()

  // Product detail page
  return (
    <section className="py-16">
      <Container>
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-10">
          <Link href="/" className="hover:text-teal transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-teal transition-colors">Products</Link>
          {product.category_id && (
            <>
              <span>/</span>
              <Link href={`/products/${product.category_id}`} className="hover:text-teal transition-colors">
                {product.categories?.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-700">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Product visual */}
          <div className="space-y-4">
            {/* Featured image */}
            <div className="bg-gray-50 rounded-2xl flex items-center justify-center aspect-square">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-contain p-8"
                  priority
                />
              ) : (
                <div className="text-gray-300">
                  <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Thumbnail gallery */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-gray-50 rounded-lg aspect-square flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-teal transition-all"
                >
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={`${product.name} view ${i}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="text-gray-300">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
              <Link href="/" className="hover:text-teal transition-colors">Home</Link>
              <span>/</span>
              <Link href="/products" className="hover:text-teal transition-colors">Products</Link>
              {product.categories?.slug && (
                <>
                  <span>/</span>
                  <Link href={`/products/${product.categories.slug}`} className="hover:text-teal transition-colors">
                    {product.categories.name}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="text-gray-700">{product.name}</span>
            </nav>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">(128 reviews)</span>
            </div>

            <p className="text-gray-500 leading-relaxed text-lg mb-6">
              {product.description}
            </p>

            {/* Price */}
            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <p className="text-sm text-gray-400 mb-1">Starting from</p>
              <p className="text-4xl font-bold text-gray-900">
                ₦{product.base_price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {product.turnaround_days} working days delivery
              </p>
            </div>

            {/* Quantity selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                  <button className="px-4 py-2 text-gray-600 hover:text-teal transition-colors">-</button>
                  <span className="px-4 py-2 font-medium">100</span>
                  <button className="px-4 py-2 text-gray-600 hover:text-teal transition-colors">+</button>
                </div>
                <span className="text-sm text-gray-500">Min. order: 100 units</span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <Link href={`/order?product=${product.id}`} className="flex-1 inline-flex items-center justify-center bg-teal text-white font-semibold px-8 py-4 rounded-full hover:bg-teal-light transition-colors text-center">
                Order Now
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center border-2 border-gray-900 text-gray-900 font-semibold px-8 py-4 rounded-full hover:bg-gray-900 hover:text-white transition-colors">
                Request Quote
              </Link>
            </div>

            {/* Product features */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Product Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Premium quality printing on durable stock
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Multiple size and finish options available
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Free proofing before printing
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-teal mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Delivery across Nigeria
                </li>
              </ul>
            </div>

            {/* Accepted formats */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Accepted File Formats</h3>
              <div className="flex flex-wrap gap-2">
                {product.accepted_formats.map((fmt: string) => (
                  <span
                    key={fmt}
                    className="text-sm uppercase font-medium bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg"
                  >
                    {fmt}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
