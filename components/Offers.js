'use client'

import { useState, useEffect } from 'react'

const DEFAULT_OFFERS = [
  { title: 'Morning Bundle', description: 'Buy 2 bags, get 15% off', badge: 'POPULAR' },
  { title: 'First Order', description: '20% off your first purchase', badge: 'NEW' },
  { title: 'Subscription', description: 'Monthly delivery, save 25%', badge: 'BEST VALUE' },
]

export default function Offers() {
  const [offers, setOffers] = useState(DEFAULT_OFFERS)

  useEffect(() => {
    fetch('/api/offers')
      .then((res) => res.json())
      .then((data) => (data && data.length > 0 ? setOffers(data) : setOffers(DEFAULT_OFFERS)))
      .catch(() => setOffers(DEFAULT_OFFERS))
  }, [])

  return (
    <section className="py-20 md:py-28 px-4 bg-dark">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-offwhite text-center mb-16">
          Current Offers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div
              key={offer.title}
              className="relative bg-espresso border border-gold/50 rounded-lg p-8 hover:border-gold transition-colors duration-300"
            >
              <span className="absolute -top-3 left-6 px-3 py-1 text-xs font-bold bg-gold text-dark rounded">
                {offer.badge}
              </span>
              <h3 className="font-playfair text-xl font-bold text-offwhite mb-3 mt-2">
                {offer.title}
              </h3>
              <p className="text-cream/80">{offer.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
