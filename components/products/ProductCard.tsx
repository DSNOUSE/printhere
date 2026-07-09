import Link from 'next/link'
import type { Product } from '@/lib/supabase'

type Props = {
  product: Product
}

const productIcons: Record<string, JSX.Element> = {
  'Business Cards': (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 10h18M3 14h18M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />
    </svg>
  ),
  'Flyers A5': (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
    </svg>
  ),
  'Roller Banner': (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
    </svg>
  ),
  'Poster A1': (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  'Booklets A4': (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  'Canvas Print': (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
  ),
}

const defaultIcon = (
  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
  </svg>
)

export function ProductCard({ product }: Props) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white rounded-2xl border border-border overflow-hidden hover:border-teal/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      {/* Icon area */}
      <div className="h-44 bg-gradient-to-br from-teal/5 to-teal/10 flex items-center justify-center text-teal group-hover:from-teal/10 group-hover:to-teal/20 transition-colors duration-300">
        {productIcons[product.name] || defaultIcon}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 group-hover:text-teal transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/60">
          <div>
            <p className="text-xs text-gray-400">From</p>
            <p className="text-lg font-bold text-teal">₦{product.base_price.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">{product.turnaround_days} day turnaround</p>
            <div className="flex gap-1 mt-1 justify-end">
              {product.accepted_formats.slice(0, 3).map((fmt) => (
                <span
                  key={fmt}
                  className="text-[10px] uppercase font-medium bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded"
                >
                  {fmt}
                </span>
              ))}
              {product.accepted_formats.length > 3 && (
                <span className="text-[10px] text-gray-400">+{product.accepted_formats.length - 3}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
