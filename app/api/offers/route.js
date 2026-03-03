import { NextResponse } from 'next/server'
import connectDB from '../../../lib/mongodb'
import Offer from '../../../models/Offer'
import { verifyToken } from '../../../lib/auth'

export const dynamic = 'force-dynamic'

const DEFAULT_OFFERS = [
  { title: 'Morning Bundle', description: 'Buy 2 bags, get 15% off', badge: 'POPULAR' },
  { title: 'First Order', description: '20% off your first purchase', badge: 'NEW' },
  { title: 'Subscription', description: 'Monthly delivery, save 25%', badge: 'BEST VALUE' },
]

function formatOffer(o) {
  return {
    _id: o._id?.toString(),
    title: o.title,
    description: o.description,
    badge: o.badge || 'NEW',
    discountPercentage: o.discountPercentage ?? 0,
    active: o.active ?? true,
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all') === 'true'

    await connectDB()
    const query = all ? {} : { active: true }
    const offers = await Offer.find(query).sort({ createdAt: 1 }).lean()

    if (!offers || offers.length === 0) {
      return NextResponse.json(all ? [] : DEFAULT_OFFERS)
    }

    return NextResponse.json(offers.map(formatOffer))
  } catch (error) {
    return NextResponse.json(DEFAULT_OFFERS)
  }
}

export async function POST(request) {
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
    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      )
    }

    await connectDB()
    const offer = await Offer.create({
      title: body.title,
      description: body.description,
      badge: body.badge || 'NEW',
      discountPercentage: body.discountPercentage ?? 0,
      active: body.active !== false,
    })

    return NextResponse.json(formatOffer(offer.toObject()))
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
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
    if (!body._id) {
      return NextResponse.json({ error: 'Offer _id is required' }, { status: 400 })
    }

    await connectDB()
    const update = {}
    if (body.title !== undefined) update.title = body.title
    if (body.description !== undefined) update.description = body.description
    if (body.badge !== undefined) update.badge = body.badge
    if (body.discountPercentage !== undefined) update.discountPercentage = body.discountPercentage
    if (body.active !== undefined) update.active = body.active

    const offer = await Offer.findByIdAndUpdate(body._id, { $set: update }, { new: true }).lean()
    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
    }

    return NextResponse.json(formatOffer(offer))
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
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

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'id query parameter is required' }, { status: 400 })
    }

    await connectDB()
    const result = await Offer.findByIdAndDelete(id)
    if (!result) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
