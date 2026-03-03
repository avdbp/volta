'use client'

import { useState, useEffect } from 'react'

const DEFAULT_ABOUT = {
  aboutTitle: 'Rooted in craft, driven by origin',
  aboutBody:
    'At Volta Coffee, we believe every bean tells a story. We source directly from small farms across Ethiopia, Colombia, and Guatemala, building relationships that span generations. Our roastery in the heart of Barcelona is where we bring these stories to life.\n\nEach batch is roasted by hand in our Probat, allowing us to highlight the unique character of every origin. We don\'t chase trends—we chase flavor, consistency, and the kind of coffee that makes you pause.',
  aboutImage: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
}

export default function About() {
  const [settings, setSettings] = useState(DEFAULT_ABOUT)

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) =>
        setSettings({
          aboutTitle: data.aboutTitle || DEFAULT_ABOUT.aboutTitle,
          aboutBody: data.aboutBody || DEFAULT_ABOUT.aboutBody,
          aboutImage: data.aboutImage || DEFAULT_ABOUT.aboutImage,
        })
      )
      .catch(() => setSettings(DEFAULT_ABOUT))
  }, [])

  return (
    <section id="about" className="py-20 md:py-28 px-4 bg-espresso">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden order-2 md:order-1">
            <img
              src={settings.aboutImage}
              alt="About"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-offwhite mb-6">
              {settings.aboutTitle}
            </h2>
            <div className="text-cream/90 leading-relaxed">
              {settings.aboutBody.split('\n\n').map((paragraph, i) => (
                <p key={i} className={i === 0 ? 'mb-4' : 'mb-6'}>
                  {paragraph}
                </p>
              ))}
            </div>
            <p className="font-playfair text-lg text-gold font-semibold">
              Marc Puig, Head Roaster
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
