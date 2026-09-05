import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { productsAPI } from '../api';
import { ScrollReveal } from './PageTransition';

/**
 * HomeDecorSpotlight — Homepage bridge section between CollectionGrid and FeaturedProducts.
 * Fetches up to 4 Home Decor products and shows them as a compact preview grid alongside
 * an editorial text column. If no products exist yet, renders a lifestyle placeholder.
 */

function SpotlightSkeleton({ darkMode: dm }) {
  return (
    <div className={`rounded-2xl overflow-hidden animate-pulse ${dm ? 'bg-moon-space/50' : 'bg-amber-50'}`}>
      <div className={`aspect-square ${dm ? 'bg-moon-midnight/60' : 'bg-amber-100'}`} />
      <div className="p-3 space-y-2">
        <div className={`h-3 rounded-full w-3/4 ${dm ? 'bg-moon-midnight/60' : 'bg-amber-100'}`} />
        <div className={`h-3 rounded-full w-1/2 ${dm ? 'bg-moon-midnight/60' : 'bg-amber-100'}`} />
      </div>
    </div>
  );
}

function SpotlightCard({ product, darkMode: dm }) {
  const imgUrl =
    product.images?.[0]?.urls?.medium ||
    product.images?.[0]?.urls?.thumbnail ||
    product.images?.[0]?.url ||
    '';
  const name = product.name
    ?.replace(/\s*\|\|\s*#\d+/g, '')
    .replace(/\s*#\d+$/, '')
    .trim();

  return (
    <motion.div whileHover={{ y: -4 }} className="group">
      <Link to={`/products/${product._id}`} className={`block rounded-xl overflow-hidden ${dm ? 'bg-moon-space/40 border border-moon-silver/10 hover:border-amber-400/30' : 'bg-white border border-gray-100 hover:border-amber-200 shadow-sm hover:shadow-md'} transition-all duration-300`}>
        <div className="relative aspect-square overflow-hidden">
          {imgUrl ? (
            <img
              src={imgUrl}
              alt={name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-4xl ${dm ? 'bg-moon-midnight' : 'bg-amber-50'}`}>
              🏠
            </div>
          )}
        </div>
        <div className="p-3">
          <p className={`text-xs font-semibold line-clamp-2 ${dm ? 'text-white' : 'text-gray-800'}`}>{name}</p>
          <p className="text-xs text-amber-600 font-bold mt-1">৳{product.basePrice}</p>
        </div>
      </Link>
    </motion.div>
  );
}

// Placeholder cards for when no products are in DB yet
const PLACEHOLDER_ITEMS = [
  { id: 'ph1', emoji: '🛋️', label: 'Cushion Covers', desc: 'From ৳XXX', href: '/products?category=cushion-cover' },
  { id: 'ph2', emoji: '🕐', label: 'Wall Clocks', desc: 'From ৳XXX', href: '/products?category=wall-clock' },
  { id: 'ph3', emoji: '🖼️', label: 'Photo Frames', desc: 'From ৳XXX', href: '/products?category=photo-frame' },
  { id: 'ph4', emoji: '🎨', label: 'Canvas Prints', desc: 'From ৳XXX', href: '/products?category=canvas-print' },
];

export default function HomeDecorSpotlight({ darkMode = false }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dm = darkMode;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productsAPI.getAll({
          productType: 'home-decor',
          limit: 4,
          sort: 'createdAt_desc',
        });
        const data = res.data || res;
        setProducts(data.products || data || []);
      } catch {
        // Silently fail — section will show placeholders
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const hasProducts = !loading && products.length > 0;
  const showPlaceholders = !loading && products.length === 0;

  return (
    <ScrollReveal>
      <section className={`py-12 sm:py-16 transition-colors duration-300 ${dm ? 'bg-gradient-to-br from-amber-900/10 to-moon-midnight/50' : 'bg-gradient-to-br from-amber-50 to-rose-50/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* Left — Editorial Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded-full mb-5">
                🏠 New at VYBE
              </span>

              <h2 className={`text-3xl sm:text-4xl font-black leading-tight mb-4 ${dm ? 'text-white' : 'text-gray-900'}`}>
                Home Decor{' '}
                <span className="bg-gradient-to-r from-amber-500 to-rose-500 bg-clip-text text-transparent">
                  Has Arrived
                </span>
              </h2>

              <p className={`text-base sm:text-lg mb-6 leading-relaxed ${dm ? 'text-moon-silver' : 'text-gray-600'}`}>
                Transform your living space with premium cushion covers, wall clocks, photo frames, and canvas prints.
                Hand-curated for the VYBE aesthetic — warm, minimal, and effortlessly stylish.
              </p>

              {/* Mini feature list */}
              <ul className="space-y-2 mb-8">
                {[
                  { icon: '✓', text: 'Premium materials — fabric, wood, glass' },
                  { icon: '✓', text: 'Curated designs for every interior style' },
                  { icon: '✓', text: 'Fast delivery across Bangladesh' },
                ].map((item) => (
                  <li key={item.text} className={`flex items-center gap-2 text-sm ${dm ? 'text-moon-silver' : 'text-gray-600'}`}>
                    <span className="text-amber-500 font-bold">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>

              <Link
                to="/home-decor"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold rounded-full shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] transition-all duration-300"
              >
                Shop Home Decor <FiArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Right — Product grid or placeholders */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              {loading && (
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(4)].map((_, i) => <SpotlightSkeleton key={i} darkMode={dm} />)}
                </div>
              )}

              {hasProducts && (
                <div className="grid grid-cols-2 gap-3">
                  {products.map((p) => <SpotlightCard key={p._id} product={p} darkMode={dm} />)}
                </div>
              )}

              {showPlaceholders && (
                <div className="grid grid-cols-2 gap-3">
                  {PLACEHOLDER_ITEMS.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ y: -4 }}
                    >
                      <Link
                        to={item.href}
                        className={`group block rounded-xl overflow-hidden transition-all duration-300 ${
                          dm
                            ? 'bg-moon-space/40 border border-moon-silver/10 hover:border-amber-400/30'
                            : 'bg-white border border-amber-100 hover:border-amber-300 shadow-sm hover:shadow-md'
                        }`}
                      >
                        <div className={`aspect-square flex items-center justify-center text-5xl ${dm ? 'bg-moon-midnight/40' : 'bg-amber-50 group-hover:bg-amber-100'} transition-colors duration-300`}>
                          {item.emoji}
                        </div>
                        <div className="p-3">
                          <p className={`text-xs font-bold ${dm ? 'text-white' : 'text-gray-800'}`}>{item.label}</p>
                          <p className={`text-xs mt-0.5 ${dm ? 'text-moon-silver' : 'text-gray-500'}`}>{item.desc}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
