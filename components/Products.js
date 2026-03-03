import Image from 'next/image'

const products = [
  {
    name: 'Ethiopian Yirgacheffe',
    origin: 'Ethiopia',
    notes: 'Blueberry, Jasmine, Dark Chocolate',
    price: 18,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80',
  },
  {
    name: 'Colombian Huila',
    origin: 'Colombia',
    notes: 'Caramel, Red Apple, Nuts',
    price: 16,
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=600&q=80',
  },
  {
    name: 'Guatemalan Antigua',
    origin: 'Guatemala',
    notes: 'Cocoa, Brown Sugar, Cedar',
    price: 17,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
  },
]

export default function Products() {
  return (
    <section id="menu" className="py-20 md:py-28 px-4 bg-dark">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-offwhite text-center mb-16">
          Our Roasts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {products.map((product) => (
            <div
              key={product.name}
              className="group bg-espresso/50 rounded-lg overflow-hidden border border-cream/10 hover:border-gold/30 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-gold/20 text-gold rounded-full mb-3">
                  {product.origin}
                </span>
                <h3 className="font-playfair text-xl font-bold text-offwhite mb-2">
                  {product.name}
                </h3>
                <p className="text-cream/80 text-sm mb-4">{product.notes}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gold">${product.price}</span>
                  <button className="px-4 py-2 bg-gold text-dark font-semibold text-sm rounded hover:bg-gold/90 transition-colors duration-200">
                    Add to Bag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
