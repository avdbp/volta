import { NextResponse } from 'next/server'
import connectDB from '../../../lib/mongodb'
import Hero from '../../../models/Hero'
import { verifyToken } from '../../../lib/auth'

export const dynamic = 'force-dynamic'

const DEFAULT_HERO = {
  headline: 'Coffee Roasted With Purpose',
  subtitle: 'Single origin. Small batch. Barcelona.',
  ctaText: 'Explore Our Roasts',
  backgroundImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=80',
}

export async function GET() {
  try {
    await connectDB()
    const hero = await Hero.findOne().lean()
    if (!hero) {
      return NextResponse.json(DEFAULT_HERO)
    }
    return NextResponse.json({
      headline: hero.headline || DEFAULT_HERO.headline,
      subtitle: hero.subtitle || DEFAULT_HERO.subtitle,
      ctaText: hero.ctaText || DEFAULT_HERO.ctaText,
      backgroundImage: hero.backgroundImage || DEFAULT_HERO.backgroundImage,
    })
  } catch (error) {
    return NextResponse.json(DEFAULT_HERO)
  }
}

export async function PUT(request) {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: 'Request body must contain at least one field to update' },
        { status: 400 }
      )
    }

    const allowedFields = ['headline', 'subtitle', 'ctaText', 'backgroundImage']
    const update = {}
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        update[key] = body[key]
      }
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    await connectDB()
    let hero = await Hero.findOne()
    if (!hero) {
      hero = await Hero.create({ ...DEFAULT_HERO, ...update })
    } else {
      await Hero.updateOne({}, { $set: update })
      hero = await Hero.findOne().lean()
    }

    return NextResponse.json({
      headline: hero.headline || DEFAULT_HERO.headline,
      subtitle: hero.subtitle || DEFAULT_HERO.subtitle,
      ctaText: hero.ctaText || DEFAULT_HERO.ctaText,
      backgroundImage: hero.backgroundImage || DEFAULT_HERO.backgroundImage,
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
