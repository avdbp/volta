'use client'

import { useState, useEffect } from 'react'

const DEFAULT_HERO = {
  headline: 'Coffee Roasted With Purpose',
  subtitle: 'Single origin. Small batch. Barcelona.',
  ctaText: 'Explore Our Roasts',
  backgroundImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=80',
}

export default function Hero() {
  const [hero, setHero] = useState(DEFAULT_HERO)

  useEffect(() => {
    fetch('/api/hero')
      .then((res) => res.json())
      .then((data) => setHero(data))
      .catch(() => setHero(DEFAULT_HERO))
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <img
        src={hero.backgroundImage}
        alt="Hero background"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div className="absolute inset-0 bg-dark/60" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-offwhite mb-4 animate-fade-in">
          {hero.headline}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-cream/90 mb-8 max-w-2xl animate-fade-in-delay-1">
          {hero.subtitle}
        </p>
        <a
          href="#menu"
          className="px-8 py-3 bg-gold text-dark font-semibold rounded hover:bg-gold/90 transition-colors duration-300 animate-fade-in-delay-2"
        >
          {hero.ctaText}
        </a>
      </div>
    </section>
  )
}
