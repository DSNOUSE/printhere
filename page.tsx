'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase, type Product } from '@/lib/supabase'
import { FileUploader } from '@/components/FileUploader'
import { FilePreview } from '@/components/FilePreview'

type UploadedFile = {
  url: string
  name: string
  size: number
}

export default function OrderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cancelled = searchParams.get('cancelled')

  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .then(({ data }) => setProducts(data ?? []))
  }, [])

  const totalPrice = selectedProduct ? selectedProduct.base_price * quantity : 0

  const handleSubmit = async () => {
    if (!selectedProduct || !uploadedFile || !customerName || !customerEmail) {
      setError('Please fill in all required fields and upload your design file.')
      return
    }
    setError(null)
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          quantity,
          unitPrice: selectedProduct.base_price,
          notes,
          fileUrl: uploadedFile.url,
          fileName: uploadedFile.name,
          fileSize: uploadedFile.size,
        }),
      })
      const data = await res.json()
      if (data.url) {
        router.push(data.url)
      } else {
        throw new Error(data.error || 'Checkout failed')
      }
    } catch (err: any) {
      setError(err.message)
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Place an Order</h1>
          <p className="text-gray-500 mt-2">Upload your design and we'll take care of the rest.</p>
        </div>

        {cancelled && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-800 text-sm">
            Payment was cancelled. Your order hasn't been placed yet.
          </div>
        )}

        {/* Step 1: Your details */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">Your details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Step 2: Select product */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">
            Select product <span className="text-red-500">*</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`
                  text-left p-4 rounded-xl border-2 transition-all
                  ${selectedProduct?.id === product.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'}
                `}
              >
                <p className="font-medium text-gray-800">{product.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{product.description}</p>
                <p className="text-sm font-semibold text-blue-600 mt-2">
                  from ₦{product.base_price.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">{product.turnaround_days} day turnaround</p>
              </button>
            ))}
          </div>

          {selectedProduct && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-32 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </section>

        {/* Step 3: Upload design */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Upload your design <span className="text-red-500">*</span>
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            For best results, supply print-ready files at 300dpi with 3mm bleed.
          </p>
          <FileUploader
            onUploadComplete={setUploadedFile}
            onUploadError={(err) => setError(err.message)}
          />
          {uploadedFile && (
            <div className="mt-4">
              <FilePreview url={uploadedFile.url} fileName={uploadedFile.name} />
            </div>
          )}
        </section>

        {/* Step 4: Notes */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Special instructions</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any finishing options, delivery instructions, or questions..."
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </section>

        {/* Order summary + checkout */}
        {selectedProduct && (
          <section className="bg-gray-900 text-white rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">{selectedProduct.name}</span>
                <span>₦{selectedProduct.base_price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Quantity</span>
                <span>× {quantity}</span>
              </div>
              <div className="border-t border-gray-700 pt-2 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>₦{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-900/30 rounded-lg px-4 py-3">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !uploadedFile || !customerName || !customerEmail}
              className="w-full bg-white text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Redirecting to payment...' : `Pay ₦${totalPrice.toFixed(2)}`}
            </button>
            <p className="text-xs text-gray-500 text-center">
              Secure payment via Stripe. You'll receive a confirmation email.
            </p>
          </section>
        )}
      </div>
    </main>
  )
}
