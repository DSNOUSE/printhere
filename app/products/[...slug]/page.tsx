import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Container } from '@/components/shared/Container'
import { Button } from '@/components/shared/Button'
import { productCategories } from '@/lib/product-categories'

type Props = {
  params: Promise<{ slug: string[] }>
}

export default async function ProductCategoryPage({ params }: Props) {
  const { slug } = await params

  // No slug or too deep
  if (!slug || slug.length > 2) {
    notFound()
  }

  // Category overview (e.g. /products/business-cards)
  if (slug.length === 1) {
    const categorySlug = slug[0]
    const category = productCategories.find((c) => {
      const slugPart = c.href.split('/').pop()
      return slugPart === categorySlug
    })

    if (!category) {
      notFound()
    }

    return (
      <section className="py-16">
        <Container>
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-teal transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-teal transition-colors">Products</Link>
            <span>/</span>
            <span className="text-gray-600">{category.label}</span>
          </nav>

          <div className="max-w-2xl mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{category.label}</h1>
            <p className="mt-3 text-gray-500 leading-relaxed">
              Choose from our range of {category.label.toLowerCase()}.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group bg-white rounded-2xl border border-border p-6 hover:border-teal/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
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

  // Subcategory detail (e.g. /products/business-cards/standard)
  if (slug.length === 2) {
    const categorySlug = slug[0]
    const subcategorySlug = slug[1]

    const category = productCategories.find((c) => {
      const slugPart = c.href.split('/').pop()
      return slugPart === categorySlug
    })

    if (!category) {
      notFound()
    }

    const item = category.items.find((i) => {
      const slugPart = i.href.split('/').pop()
      return slugPart === subcategorySlug
    })

    if (!item) {
      notFound()
    }

    return (
      <section className="py-16">
        <Container>
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-teal transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-teal transition-colors">Products</Link>
            <span>/</span>
            <Link href={category.href} className="hover:text-teal transition-colors">{category.label}</Link>
            <span>/</span>
            <span className="text-gray-600">{item.label}</span>
          </nav>

          <div className="max-w-2xl mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{item.label}</h1>
            <p className="mt-3 text-gray-500 leading-relaxed">
              Browse our range of {item.label.toLowerCase()} or get in touch for a custom quote.
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

  notFound()
}