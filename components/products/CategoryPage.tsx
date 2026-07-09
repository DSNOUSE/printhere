import Link from 'next/link'
import { Container } from '@/components/shared/Container'
import { Button } from '@/components/shared/Button'
import { productCategories, type ProductCategory } from '@/lib/product-categories'

type Props = {
  category?: ProductCategory
  subcategory?: { label: string; href: string }
}

export function CategoryPage({ category, subcategory }: Props) {
  // If viewing a subcategory
  if (subcategory && category) {
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
            <span className="text-gray-600">{subcategory.label}</span>
          </nav>

          <div className="max-w-2xl mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{subcategory.label}</h1>
            <p className="mt-3 text-gray-500 leading-relaxed">
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

  // If viewing a category overview
  if (category) {
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

  // Fallback: all categories overview
  return (
    <section className="py-16">
      <Container>
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-teal transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-600">Products</span>
        </nav>

        <div className="max-w-2xl mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Our Products</h1>
          <p className="mt-3 text-gray-500 leading-relaxed">
            Premium printing for every need. Browse our categories below.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productCategories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group bg-white rounded-2xl border border-border p-6 hover:border-teal/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-teal transition-colors">
                {cat.label}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {cat.items.length} options available
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}