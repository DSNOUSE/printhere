'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/shared/Button'

const slides = [
  {
    id: 1,
    title: 'Marketing Materials, make your brand stand out',
    description: "We're here to help your business stand out for your next big campaign.",
    cta: 'Shop now',
    ctaLink: '/products',
    image: '/images/hero-main.jpg',
  },
  {
    id: 2,
    title: 'Premium Business Cards & Stationery',
    description: 'Professional printing services for all your business needs.',
    cta: 'Get Started',
    ctaLink: '/products',
    image: '/images/main-landing.png',
  },
  {
    id: 3,
    title: 'Large Format Printing',
    description: 'Banners, posters, and signage that make an impact.',
    cta: 'Learn More',
    ctaLink: '/contact',
    image: '/images/hero-main.jpg',
  },
]

export function Hero() {
  const [current, setCurrent] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrent(index)
    setIsAutoPlaying(false)
    // Resume autoplay after 10 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-[40vh] sm:h-[50vh] lg:h-[60vh]">
        {/* Left side - Text content */}
        <div className="flex items-center justify-center bg-[#a8c5c5] px-8 sm:px-12 lg:px-20">
          <div className="max-w-xl animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight">
              {slides[current].title.split(' ').map((word, i) => (
                <span key={i}>
                  {i === 3 ? <><br />{word} </> : `${word} `}
                </span>
              ))}
            </h1>
            <p className="mt-6 text-lg text-gray-800 leading-relaxed">
              {slides[current].description}
            </p>
            <div className="mt-8">
              <Button href={slides[current].ctaLink} size="lg">
                {slides[current].cta}
              </Button>
            </div>

            {/* Pagination dots */}
            <div className="flex gap-2 mt-6">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-1 transition-all ${
                    index === current ? 'w-8 bg-gray-900' : 'w-4 bg-gray-900/30'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Navigation arrows positioned to the right */}
          <div className="absolute right-8 sm:right-12 lg:right-20 top-1/2 -translate-y-1/2 flex flex-col gap-3">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full border-2 border-gray-900 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-colors"
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full border-2 border-gray-900 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-colors"
              aria-label="Next slide"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="relative flex items-center justify-center bg-[#e8ddd5]">
          <div className="relative w-full h-full">
            <Image
              src={slides[current].image}
              alt={slides[current].title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
