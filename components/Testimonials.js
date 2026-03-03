const testimonials = [
  {
    quote: 'The Ethiopian Yirgacheffe is the best coffee I\'ve ever had. Volta has ruined other coffee for me.',
    author: 'Elena M.',
  },
  {
    quote: 'Finally, a roastery in Barcelona that understands single origin. The Guatemalan Antigua is incredible.',
    author: 'Pau R.',
  },
  {
    quote: 'I\'ve been a subscriber for 6 months. Consistent quality, fast delivery, and the Morning Bundle is a steal.',
    author: 'Sofia L.',
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28 px-4 bg-espresso">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-offwhite text-center mb-16">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.author}
              className="bg-dark/50 border border-cream/10 rounded-lg p-8"
            >
              <p className="text-cream/90 italic mb-6 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <p className="font-semibold text-gold">{testimonial.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
