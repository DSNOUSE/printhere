'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase, type Product } from '@/lib/supabase'
import { FileUploader } from '@/components/order/FileUploader'
import { FilePreview } from '@/components/shared/FilePreview'
import { Container } from '@/components/shared/Container'
import { Button } from '@/components/shared/Button'

type UploadedFile = {
  url: string
  name: string
  size: number
}

const steps = ['Product', 'Upload', 'Details', 'Review']

export default function OrderPage() {
  return (
    <Suspense fallback={
      <section className="py-16"><Container className="max-w-3xl"><div className="text-center py-20 text-gray-400">Loading...</div></Container></section>
    }>
      <OrderPageContent />
    </Suspense>
  )
}

function OrderPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cancelled = searchParams.get('cancelled')
  const preselectedProductId = searchParams.get('product')
  const reference = searchParams.get('reference')

  const [currentStep, setCurrentStep] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderStatus, setOrderStatus] = useState<{ id: string; status: string; product_name: string; quantity: number; total_price: number } | null>(null)
  const [statusLoading, setStatusLoading] = useState(false)

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .then(({ data }) => {
        const items = data ?? []
        setProducts(items)
        if (preselectedProductId) {
          const found = items.find((p) => p.id === preselectedProductId)
          if (found) {
            setSelectedProduct(found)
            setCurrentStep(1) // Skip to upload step
          }
        }
      })
  }, [preselectedProductId])

  useEffect(() => {
    if (!reference) return
    setStatusLoading(true)
    fetch(`/api/order-status?reference=${reference}`)
      .then((r) => r.json())
      .then((d) => setOrderStatus(d.order ?? null))
      .catch(() => setOrderStatus(null))
      .finally(() => setStatusLoading(false))
  }, [reference])

  const totalPrice = selectedProduct ? selectedProduct.base_price * quantity : 0

  const canProceed = () => {
    switch (currentStep) {
      case 0: return !!selectedProduct
      case 1: return !!uploadedFile
      case 2: return !!customerName.trim() && !!customerEmail.trim()
      case 3: return true
      default: return false
    }
  }

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
          quantity,
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setIsSubmitting(false)
    }
  }

  if (reference) {
    return (
      <section className="py-16">
        <Container className="max-w-2xl">
          {statusLoading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 mx-auto rounded-xl bg-teal/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <p className="text-gray-500">Confirming your payment...</p>
            </div>
          ) : orderStatus?.status === 'paid' ? (
            <div className="bg-white rounded-2xl border border-border p-8 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Payment confirmed</h1>
              <p className="text-gray-500 mt-2">Your order is confirmed and a receipt has been emailed to you.</p>
              <div className="mt-6 text-left bg-cream rounded-xl p-5 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Order</span><span className="font-medium text-gray-900">#{orderStatus.id.slice(0, 8).toUpperCase()}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Product</span><span className="font-medium text-gray-900">{orderStatus.product_name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Quantity</span><span className="font-medium text-gray-900">{orderStatus.quantity}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Total paid</span><span className="font-bold text-teal">₦{orderStatus.total_price.toLocaleString()}</span></div>
              </div>
              <div className="flex flex-wrap gap-3 justify-center mt-6">
                <Button href="/order">Place another order</Button>
                <Button href="/" variant="outline">Back to home</Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-border p-8 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Payment not confirmed yet</h1>
              <p className="text-gray-500 mt-2">If you completed payment, your receipt will arrive by email shortly. Otherwise you can try again.</p>
              <div className="flex flex-wrap gap-3 justify-center mt-6">
                <Button href="/order">Try again</Button>
                <Button href="/contact" variant="outline">Contact us</Button>
              </div>
            </div>
          )}
        </Container>
      </section>
    )
  }

  return (
    <section className="py-16">
      <Container className="max-w-3xl">
        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Place an Order</h1>
          <p className="text-gray-500 mt-2">Upload your design and we&apos;ll take care of the rest.</p>
        </div>

        {cancelled && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-800 text-sm mb-8">
            Payment was cancelled. Your order hasn&apos;t been placed yet.
          </div>
        )}

        {/* Step progress */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <button
                onClick={() => { if (i < currentStep) setCurrentStep(i) }}
                className={`
                  flex items-center gap-2 text-sm font-medium transition-colors
                  ${i <= currentStep ? 'text-teal' : 'text-gray-400'}
                  ${i < currentStep ? 'cursor-pointer hover:text-teal-light' : 'cursor-default'}
                `}
              >
                <span className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                  ${i < currentStep
                    ? 'bg-teal border-teal text-white'
                    : i === currentStep
                      ? 'border-teal text-teal'
                      : 'border-gray-300 text-gray-400'}
                `}>
                  {i < currentStep ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px ${i < currentStep ? 'bg-teal' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8 mb-6">
          {/* Step 0: Select product */}
          {currentStep === 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-5">
                Select a product
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className={`
                      text-left p-4 rounded-xl border-2 transition-all
                      ${selectedProduct?.id === product.id
                        ? 'border-teal bg-teal/5'
                        : 'border-border hover:border-teal/30'}
                    `}
                  >
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{product.description}</p>
                    <p className="text-sm font-semibold text-teal mt-2">
                      from ₦{product.base_price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">{product.turnaround_days} day turnaround</p>
                  </button>
                ))}
              </div>

              {selectedProduct && (
                <div className="mt-5">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-32 border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 1: Upload design */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Upload your design
              </h2>
              <p className="text-sm text-gray-500 mb-5">
                For best results, supply print-ready files at 300dpi with 3mm bleed.
              </p>
              <FileUploader
                onUploadComplete={(file) => setUploadedFile(file)}
                onUploadError={(err) => setError(err.message)}
              />
              {uploadedFile && (
                <div className="mt-4">
                  <FilePreview url={uploadedFile.url} fileName={uploadedFile.name} />
                </div>
              )}
            </div>
          )}

          {/* Step 2: Customer details */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Your details</h2>
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
                    className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal"
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
                    className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special instructions <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any finishing options, delivery instructions, or questions..."
                  rows={3}
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 3: Review & Pay */}
          {currentStep === 3 && selectedProduct && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Review your order</h2>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-border/60">
                  <span className="text-gray-500">Product</span>
                  <span className="font-medium text-gray-900">{selectedProduct.name}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border/60">
                  <span className="text-gray-500">Unit Price</span>
                  <span className="font-medium text-gray-900">₦{selectedProduct.base_price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border/60">
                  <span className="text-gray-500">Quantity</span>
                  <span className="font-medium text-gray-900">{quantity}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border/60">
                  <span className="text-gray-500">Design File</span>
                  <span className="font-medium text-gray-900 truncate max-w-[200px]">{uploadedFile?.name}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border/60">
                  <span className="text-gray-500">Customer</span>
                  <span className="font-medium text-gray-900">{customerName}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border/60">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-gray-900">{customerEmail}</span>
                </div>
                {notes && (
                  <div className="flex justify-between py-3 border-b border-border/60">
                    <span className="text-gray-500">Notes</span>
                    <span className="font-medium text-gray-900 text-right max-w-[250px]">{notes}</span>
                  </div>
                )}
                <div className="flex justify-between py-4">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-teal">₦{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full mt-6 bg-teal text-white font-semibold py-3.5 rounded-full hover:bg-teal-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Redirecting to payment...' : `Pay ₦${totalPrice.toLocaleString()}`}
              </button>
              <p className="text-xs text-gray-400 text-center mt-3">
                Secure payment via Paystack. You&apos;ll receive a confirmation email.
              </p>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            className={`text-sm font-medium text-gray-500 hover:text-teal transition-colors ${
              currentStep === 0 ? 'invisible' : ''
            }`}
          >
            ← Back
          </button>
          {currentStep < 3 && (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className="bg-teal text-white font-semibold px-8 py-3 rounded-full hover:bg-teal-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          )}
        </div>
      </Container>
    </section>
  )
}
