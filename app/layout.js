import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import AdminButton from '../components/AdminButton'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

export const metadata = {
  title: 'VOLTA COFFEE | Specialty Coffee Roastery Barcelona',
  description: 'Single origin. Small batch. Barcelona.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>
        {children}
        <AdminButton />
      </body>
    </html>
  )
}
