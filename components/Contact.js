export default function Contact() {
  return (
    <section id="contact" className="py-20 md:py-28 px-4 bg-dark">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-offwhite mb-6">
              Get in Touch
            </h2>
            <div className="space-y-4 text-cream/90">
              <p className="flex items-start gap-3">
                <span className="text-gold font-semibold min-w-[80px]">Address:</span>
                Carrer de Provença 234, Barcelona
              </p>
              <p className="flex items-start gap-3">
                <span className="text-gold font-semibold min-w-[80px]">Email:</span>
                hello@voltacoffee.com
              </p>
              <p className="flex items-start gap-3">
                <span className="text-gold font-semibold min-w-[80px]">Phone:</span>
                +34 93 000 0000
              </p>
            </div>
          </div>
          <div>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-cream/90 text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 bg-espresso border border-cream/20 rounded text-offwhite placeholder-cream/50 focus:border-gold focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-cream/90 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 bg-espresso border border-cream/20 rounded text-offwhite placeholder-cream/50 focus:border-gold focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-cream/90 text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 bg-espresso border border-cream/20 rounded text-offwhite placeholder-cream/50 focus:border-gold focus:outline-none transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>
              <button
                type="button"
                className="w-full px-6 py-3 bg-gold text-dark font-semibold rounded hover:bg-gold/90 transition-colors duration-200"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
