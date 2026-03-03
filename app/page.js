import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Products from '../components/Products'
import About from '../components/About'
import Offers from '../components/Offers'
import Testimonials from '../components/Testimonials'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Products />
      <About />
      <Offers />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  )
}
