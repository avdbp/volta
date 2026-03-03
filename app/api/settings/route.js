import { NextResponse } from 'next/server'
import connectDB from '../../../lib/mongodb'
import SiteSettings from '../../../models/SiteSettings'
import { verifyToken } from '../../../lib/auth'

export const dynamic = 'force-dynamic'

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

export async function GET() {
  try {
    await connectDB()
    const settings = await SiteSettings.findOne().lean()
    if (!settings) {
      return NextResponse.json(DEFAULT_SETTINGS)
    }
    return NextResponse.json({
      aboutTitle: settings.aboutTitle || DEFAULT_SETTINGS.aboutTitle,
      aboutBody: settings.aboutBody || DEFAULT_SETTINGS.aboutBody,
      aboutImage: settings.aboutImage || DEFAULT_SETTINGS.aboutImage,
      heroImage: settings.heroImage || DEFAULT_SETTINGS.heroImage,
      contactEmail: settings.contactEmail || DEFAULT_SETTINGS.contactEmail,
      contactPhone: settings.contactPhone || DEFAULT_SETTINGS.contactPhone,
      contactAddress: settings.contactAddress || DEFAULT_SETTINGS.contactAddress,
    })
  } catch (error) {
    return NextResponse.json(DEFAULT_SETTINGS)
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

    await connectDB()
    const body = await request.json()
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Request body must contain at least one field to update' },
        { status: 400 }
      )
    }

    const allowedFields = [
      'aboutTitle',
      'aboutBody',
      'aboutImage',
      'heroImage',
      'contactEmail',
      'contactPhone',
      'contactAddress',
    ]
    const update = {}
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        update[key] = body[key]
      }
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    let settings = await SiteSettings.findOne()
    if (!settings) {
      settings = await SiteSettings.create({ ...DEFAULT_SETTINGS, ...update })
    } else {
      settings = await SiteSettings.findOneAndUpdate({}, { $set: update }, { new: true })
    }

    const s = settings.toObject ? settings.toObject() : settings
    return NextResponse.json({
      success: true,
      data: {
        aboutTitle: s.aboutTitle || DEFAULT_SETTINGS.aboutTitle,
        aboutBody: s.aboutBody || DEFAULT_SETTINGS.aboutBody,
        aboutImage: s.aboutImage || DEFAULT_SETTINGS.aboutImage,
        heroImage: s.heroImage || DEFAULT_SETTINGS.heroImage,
        contactEmail: s.contactEmail || DEFAULT_SETTINGS.contactEmail,
        contactPhone: s.contactPhone || DEFAULT_SETTINGS.contactPhone,
        contactAddress: s.contactAddress || DEFAULT_SETTINGS.contactAddress,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
