import { Container } from '@/components/shared/Container'

const steps = [
  {
    number: '01',
    title: 'Choose Your Product',
    description: 'Browse our catalog and select the print product that fits your needs.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Upload Your Design',
    description: 'Upload your print-ready file — we accept PDF, AI, PSD, and image formats.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'We Print & Deliver',
    description: 'Sit back while we handle production and deliver straight to your door.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            How It Works
          </h2>
          <p className="mt-3 text-gray-500 max-w-md mx-auto">
            Three simple steps to get your prints done — no hassle, no fuss.
          </p>
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-border via-teal/30 to-border" aria-hidden="true" />

          {steps.map((step) => (
            <div key={step.number} className="relative text-center group">
              <div className="relative mx-auto w-20 h-20 rounded-2xl bg-white border-2 border-border flex items-center justify-center text-teal group-hover:border-teal group-hover:shadow-lg transition-all duration-300 mb-6">
                {step.icon}
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-teal text-white text-xs font-bold flex items-center justify-center">
                  {step.number}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
