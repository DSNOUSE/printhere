import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from '@/components/shared/Container'
import { Button } from '@/components/shared/Button'
import { supabase } from '@/lib/supabase'

export const revalidate = 60

type Props = {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) notFound()

  return (
    <section className="py-16">
      <Container>
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-10">
          <Link href="/" className="hover:text-teal transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-teal transition-colors">Products</Link>
          <span>/</span>
          <span className="text-gray-700">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product visual */}
          <div className="bg-gradient-to-br from-teal/5 to-teal/10 rounded-3xl flex items-center justify-center min-h-[360px]">
            <div className="text-teal/60">
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </div>
          </div>

          {/* Product info */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>
            <p className="mt-3 text-gray-500 leading-relaxed text-lg">
              {product.description}
            </p>

            <div className="mt-8">
              <p className="text-sm text-gray-400">Starting from</p>
              <p className="text-4xl font-bold text-teal mt-1">
                ₦{product.base_price.toLocaleString()}
              </p>
            </div>

            {/* Specs */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 rounded-xl bg-teal/10 text-teal flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Turnaround Time</p>
                  <p className="text-gray-500">{product.turnaround_days} working days</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 rounded-xl bg-teal/10 text-teal flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Accepted Formats</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {product.accepted_formats.map((fmt: string) => (
                      <span
                        key={fmt}
                        className="text-xs uppercase font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                      >
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href={`/order?product=${product.id}`} size="lg">
                Order Now
              </Button>
              <Button href="/contact" variant="outline" size="lg">
                Request Quote
              </Button>
            </div>

            <p className="mt-4 text-xs text-gray-400">
              Need a custom order? <Link href="/contact" className="text-teal hover:underline">Contact us</Link> for bulk pricing and special requirements.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
