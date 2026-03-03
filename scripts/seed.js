const path = require('path')
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') })
const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env.local')
  process.exit(1)
}

const heroSchema = new mongoose.Schema({
  headline: { type: String, default: 'Coffee Roasted With Purpose' },
  subtitle: { type: String, default: 'Single origin. Small batch. Barcelona.' },
  ctaText: { type: String, default: 'Explore Our Roasts' },
  backgroundImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=80',
  },
})

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  badge: { type: String, default: 'NEW' },
  discountPercentage: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
})

const siteSettingsSchema = new mongoose.Schema({
  aboutTitle: { type: String, default: 'Rooted in craft, driven by origin' },
  aboutBody: { type: String, default: 'We source our beans directly from farmers...' },
  aboutImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
  },
  heroImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=80',
  },
  contactEmail: { type: String, default: 'hello@voltacoffee.com' },
  contactPhone: { type: String, default: '+34 93 000 0000' },
  contactAddress: { type: String, default: 'Carrer de Provença 234, Barcelona' },
})

const Hero = mongoose.models.Hero || mongoose.model('Hero', heroSchema)
const Offer = mongoose.models.Offer || mongoose.model('Offer', offerSchema)
const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', siteSettingsSchema)

const defaultOffers = [
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

const defaultSiteSettings = {
  aboutTitle: 'Rooted in craft, driven by origin',
  aboutBody:
    'At Volta Coffee, we believe every bean tells a story. We source directly from small farms across Ethiopia, Colombia, and Guatemala, building relationships that span generations. Our roastery in the heart of Barcelona is where we bring these stories to life.\n\nEach batch is roasted by hand in our Probat, allowing us to highlight the unique character of every origin. We don\'t chase trends—we chase flavor, consistency, and the kind of coffee that makes you pause.',
  aboutImage: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
  heroImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=80',
  contactEmail: 'hello@voltacoffee.com',
  contactPhone: '+34 93 000 0000',
  contactAddress: 'Carrer de Provença 234, Barcelona',
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    const heroCount = await Hero.countDocuments()
    if (heroCount === 0) {
      await Hero.create({})
      console.log('✓ Inserted default Hero document')
    } else {
      console.log('- Hero collection already has data, skipped')
    }

    const offerCount = await Offer.countDocuments()
    if (offerCount === 0) {
      await Offer.insertMany(defaultOffers)
      console.log('✓ Inserted 3 default offers')
    } else {
      console.log('- Offers collection already has data, skipped')
    }

    const settingsCount = await SiteSettings.countDocuments()
    if (settingsCount === 0) {
      await SiteSettings.create(defaultSiteSettings)
      console.log('✓ Inserted default SiteSettings document')
    } else {
      console.log('- SiteSettings collection already has data, skipped')
    }

    console.log('\nSeed completed successfully')
  } catch (error) {
    console.error('Seed failed:', error.message)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
    process.exit(0)
  }
}

seed()
