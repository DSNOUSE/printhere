import Image from 'next/image'
import { Container } from '@/components/shared/Container'

const values = [
  {
    icon: '/images/icons/fast-time.png',
    title: 'Fast Turnaround',
    description: '3–7 day delivery on all products',
  },
  {
    icon: '/images/icons/quality.png',
    title: 'Premium Quality',
    description: 'High-resolution prints on quality stock',
  },
  {
    icon: '/images/icons/folder.png',
    title: 'Easy File Upload',
    description: 'Upload PDF, AI, PSD & image files',
  },
  {
    icon: '/images/icons/secure-payment.png',
    title: 'Secure Payments',
    description: 'Powered by Stripe for safe checkout',
  },
]

export function TrustBar() {
  return (
    <section className="py-12 border-y border-border">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {values.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <div className="flex-shrink-0 flex items-center justify-center">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={36}
                  height={36}
                  className="w-9 h-9 object-contain"
                />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
