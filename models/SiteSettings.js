import mongoose from 'mongoose'

const siteSettingsSchema = new mongoose.Schema({
  aboutTitle: {
    type: String,
    default: 'Rooted in craft, driven by origin',
  },
  aboutBody: {
    type: String,
    default: 'We source our beans directly from farmers...',
  },
  aboutImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80',
  },
  heroImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=80',
  },
  contactEmail: {
    type: String,
    default: 'hello@voltacoffee.com',
  },
  contactPhone: {
    type: String,
    default: '+34 93 000 0000',
  },
  contactAddress: {
    type: String,
    default: 'Carrer de Provença 234, Barcelona',
  },
})

export default mongoose.models.SiteSettings || mongoose.model('SiteSettings', siteSettingsSchema)
