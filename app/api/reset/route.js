import { NextResponse } from 'next/server'
import connectDB from '../../../lib/mongodb'
import Hero from '../../../models/Hero'
import Offer from '../../../models/Offer'
import SiteSettings from '../../../models/SiteSettings'
import { verifyToken } from '../../../lib/auth'

export const dynamic = 'force-dynamic'

const DEFAULT_HERO = {
  headline: 'Coffee Roasted With Purpose',
  subtitle: 'Single origin. Small batch. Barcelona.',
  ctaText: 'Explore Our Roasts',
  backgroundImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=80',
}

const DEFAULT_OFFERS = [
  {
    title: 'Morning Bundle',
    description: 'Buy 2 bags, get 15% off',
    badge: 'POPULAR',
    discountPercentage: 15,
    active: true,
  },
  {
    title: 'First Order',
    description: '20% off your first purchase',
    badge: 'NEW',
    discountPercentage: 20,
    active: true,
  },
  {
    title: 'Subscription',
    description: 'Monthly delivery, save 25%',
    badge: 'BEST VALUE',
    discountPercentage: 25,
    active: true,
  },
]

const DEFAULT_SETTINGS = {
  aboutTitle: 'Rooted in craft, driven by origin',
  aboutBody:
    'At Volta Coffee, we believe every bean tells a story. We source directly from small farms across Ethiopia, Colombia, and Guatemala, building relationships that span generations. Our roastery in the heart of Barcelona is where we bring these stories to life.\n\nEach batch is roasted by hand in our Probat, allowing us to highlight the unique character of every origin. We don\'t chase trends—we chase flavor, consistency, and the kind of coffee that makes you pause.',
  aboutImage: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
  heroImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=80',
  contactEmail: 'hello@voltacoffee.com',
  contactPhone: '+34 93 000 0000',
  contactAddress: 'Carrer de Provença 234, Barcelona',
}

export async function GET(request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.split(' ')[1]
    const cronSecret = process.env.NEXT_PUBLIC_CRON_SECRET
    const adminPayload = verifyToken(token)
    const validCron = cronSecret && token === cronSecret
    if (!adminPayload && !validCron) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    await Hero.deleteMany({})
    await Offer.deleteMany({})
    await SiteSettings.deleteMany({})

    await Hero.create(DEFAULT_HERO)
    await Offer.insertMany(DEFAULT_OFFERS)
    await SiteSettings.create(DEFAULT_SETTINGS)

    return NextResponse.json({ success: true, message: 'Reset complete' })
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
