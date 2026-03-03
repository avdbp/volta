import mongoose from 'mongoose'

const heroSchema = new mongoose.Schema({
  headline: {
    type: String,
    default: 'Coffee Roasted With Purpose',
  },
  subtitle: {
    type: String,
    default: 'Single origin. Small batch. Barcelona.',
  },
  ctaText: {
    type: String,
    default: 'Explore Our Roasts',
  },
  backgroundImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=80',
  },
})

export default mongoose.models.Hero || mongoose.model('Hero', heroSchema)
