import Link from 'next/link'

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order confirmed!</h1>
          <p className="text-gray-500 mt-3">
            Thank you for your order. We've received your design file and payment.
            You'll get a confirmation email shortly with your order details.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 text-left space-y-3">
          <h2 className="font-semibold text-gray-800">What happens next?</h2>
          <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
            <li>Our team reviews your file for print readiness</li>
            <li>We'll email you if any adjustments are needed</li>
            <li>Your order enters production</li>
            <li>We ship and send you a tracking number</li>
          </ol>
        </div>

        <Link
          href="/order"
          className="inline-block bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors"
        >
          Place another order
        </Link>
      </div>
    </main>
  )
}
