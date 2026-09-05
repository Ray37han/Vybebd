import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowRight,
  FiSun,
  FiZap,
  FiHeart,
  FiShoppingCart,
  FiStar,
  FiChevronDown,
  FiRefreshCw,
  FiAlertTriangle,
  FiTruck,
  FiVolume2,
  FiFilm,
  FiDroplet,
  FiFeather,
  FiHome,
} from 'react-icons/fi';
import { productsAPI } from '../api';
import { useCartStore } from '../store';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/PageTransition';

const HOW_IT_WORKS = [
  { step: '01', Icon: FiSun, color: 'from-yellow-500 to-amber-500', title: 'Place Near Light', desc: 'Set it by a window, under a lamp, or on your desk. Any light source works.' },
  { step: '02', Icon: FiRefreshCw, color: 'from-blue-500 to-indigo-500', title: 'Watch It Dance', desc: 'The solar cell captures light energy and powers a silent micro-motor. It starts wobbling in seconds.' },
  { step: '03', Icon: FiZap, color: 'from-purple-500 to-pink-500', title: 'Never Stop Vibing', desc: 'No batteries. No charging. No noise. Just endless, effortless kinetic art.' },
];

const FAQ = [
  { q: 'How does it work?', a: 'A tiny solar panel captures ambient or direct light and converts it into electricity, powering a silent micro-motor. The motor creates a gentle, continuous wobbling motion.' },
  { q: 'Does it need batteries?', a: 'No batteries ever. It runs entirely on light energy — sunlight, room light, or lamp light. In complete darkness it will stop, but resumes the moment light returns.' },
  { q: 'What surfaces work best?', a: 'Any flat surface — your desk, windowsill, bookshelf, or coffee table. Near a window is ideal, but indoor room lighting works too.' },
  { q: 'Is it fragile?', a: 'The wobbler is made from durable, lightweight ABS plastic with a weighted base. Designed to wobble safely without tipping over.' },
  { q: 'How fast does it wobble?', a: 'Speed depends on light intensity. In direct sunlight it wobbles enthusiastically; under soft room lighting it moves with a gentle, meditative sway.' },
];

function ProductSkeleton({ darkMode: dm }) {
  return (
    <div className={`rounded-2xl overflow-hidden animate-pulse ${dm ? 'bg-moon-space/50' : 'bg-gray-100'}`}>
      <div className={`aspect-square ${dm ? 'bg-moon-midnight/60' : 'bg-gray-200'}`} />
      <div className="p-4 space-y-3">
        <div className={`h-4 rounded-full w-3/4 ${dm ? 'bg-moon-midnight/60' : 'bg-gray-200'}`} />
        <div className={`h-3 rounded-full w-1/2 ${dm ? 'bg-moon-midnight/60' : 'bg-gray-200'}`} />
        <div className={`h-10 rounded-xl ${dm ? 'bg-moon-midnight/60' : 'bg-gray-200'}`} />
      </div>
    </div>
  );
}

function FAQItem({ item, darkMode: dm }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-b ${dm ? 'border-moon-silver/10' : 'border-gray-200'}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between py-5 text-left gap-4 ${dm ? 'text-white' : 'text-gray-900'}`}
        aria-expanded={open}
      >
        <span className="font-semibold text-base">{item.q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <FiChevronDown className={`w-5 h-5 flex-none ${dm ? 'text-moon-silver' : 'text-gray-500'}`} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className={`pb-5 leading-relaxed ${dm ? 'text-moon-silver' : 'text-gray-600'}`}>{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function WobblerCard({ product, darkMode: dm, onBuy }) {
  const imgUrl = product.images?.[0]?.urls?.medium || product.images?.[0]?.urls?.thumbnail || product.images?.[0]?.url || '';
  const name = product.name?.replace(/\s*\|\|\s*#\d+/g, '').replace(/\s*#\d+$/, '').trim();
  const hasDiscount = product.originalPrice && product.originalPrice > product.basePrice;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 ${
        dm ? 'bg-moon-space/50 border border-moon-silver/10 hover:border-yellow-400/40 hover:shadow-xl hover:shadow-yellow-500/10'
          : 'bg-white border border-gray-100 hover:border-yellow-300 hover:shadow-xl hover:shadow-yellow-500/10'
      }`}
    >
      <Link to={`/products/${product._id}`} className="block relative overflow-hidden aspect-square">
        {imgUrl ? (
          <img src={imgUrl} alt={name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${dm ? 'bg-moon-midnight' : 'bg-yellow-50'}`}>
            <FiSun className="w-16 h-16 text-yellow-400" strokeWidth={1} />
          </div>
        )}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {Math.round(((product.originalPrice - product.basePrice) / product.originalPrice) * 100)}% OFF
          </div>
        )}
        {product.newArrival && !hasDiscount && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">NEW</div>
        )}
      </Link>
      <div className="p-3 sm:p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className={`font-semibold text-sm sm:text-base line-clamp-2 mb-1 hover:text-yellow-600 transition-colors ${dm ? 'text-white' : 'text-gray-900'}`}>{name}</h3>
        </Link>
        {product.rating?.count > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
            <span className={`text-xs ${dm ? 'text-moon-silver' : 'text-gray-500'}`}>{product.rating.average.toFixed(1)} ({product.rating.count})</span>
          </div>
        )}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base sm:text-lg font-bold text-orange-500">৳{product.basePrice}</span>
          {hasDiscount && <span className={`text-xs line-through ${dm ? 'text-moon-silver/50' : 'text-gray-400'}`}>৳{product.originalPrice}</span>}
        </div>
        <motion.button
          onClick={() => onBuy(product)}
          whileTap={{ scale: 0.97 }}
          className="w-full py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-md hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2 min-h-[44px]"
        >
          <FiShoppingCart className="w-4 h-4" />
          {product.sizes?.length > 0 ? 'Choose Options' : 'Order Now'}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function SolarWobbler() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const navigate = useNavigate();
  useCartStore((state) => state.addItem);

  useEffect(() => {
    const handleThemeChange = () => setDarkMode(localStorage.getItem('theme') === 'dark');
    window.addEventListener('storage', handleThemeChange);
    window.addEventListener('themeChange', handleThemeChange);
    return () => {
      window.removeEventListener('storage', handleThemeChange);
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await productsAPI.getAll({ category: 'solar-wobbler', limit: 12 });
        const data = res.data || res;
        setProducts(data.products || data || []);
      } catch (err) {
        console.error('SolarWobbler fetch error:', err);
        setError('Could not load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleBuy = (product) => {
    if (product.sizes?.length > 0) {
      navigate(`/products/${product._id}`);
    } else {
      const qs = new URLSearchParams({
        productId: product._id,
        name: product.name,
        price: String(product.basePrice),
        qty: '1',
        size: 'Standard',
        frame: 'No Frame',
      });
      const imgUrl = product.images?.[0]?.urls?.medium || product.images?.[0]?.url || '';
      if (imgUrl) qs.set('image', imgUrl);
      navigate(`/quick-checkout?${qs.toString()}`);
    }
  };

  const dm = darkMode;

  return (
    <>
      <Helmet>
        <title>Solar Wobbler Bangladesh — Kinetic Desk Art | VYBE</title>
        <meta name="description" content="Solar-powered wobbler — kinetic art for your desk or window. No batteries. Just vibes. Order now from VYBE Bangladesh." />
        <meta name="keywords" content="solar wobbler bangladesh, kinetic art bd, solar toy dhaka, desk decor, solar powered toy, wobbler" />
        <link rel="canonical" href="https://vybebd.store/solar-wobbler" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vybebd.store/solar-wobbler" />
        <meta property="og:title" content="Solar Wobbler Bangladesh | VYBE" />
        <meta property="og:description" content="Kinetic art powered by sunlight. No batteries. Just vibes." />
      </Helmet>

      <div className={`min-h-screen transition-colors duration-300 ${dm ? 'bg-gradient-to-br from-moon-midnight via-moon-space to-moon-midnight' : 'bg-white'}`}>

        {/* HERO */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-orange-400/15 to-red-500/10" />

          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-yellow-400/20 pointer-events-none"
              style={{ width: `${i * 280}px`, height: `${i * 280}px` }}
              animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.15, 0.3] }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
            />
          ))}

          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-yellow-400/40 pointer-events-none"
              style={{ left: `${10 + i * 10}%`, top: `${20 + (i % 3) * 20}%` }}
              animate={{ y: [-10, 10, -10], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
            />
          ))}

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh] py-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 text-sm font-semibold rounded-full mb-6"
                >
                  <FiSun className="w-4 h-4" />
                  Solar Powered · Zero Batteries
                </motion.span>

                <h1 className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight mb-6 ${dm ? 'text-white' : 'text-gray-900'}`}>
                  Powered by{' '}
                  <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                    Sunlight.
                  </span>
                  <br />
                  Driven by{' '}
                  <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                    Vibes.
                  </span>
                </h1>

                <p className={`text-lg sm:text-xl mb-8 leading-relaxed max-w-xl ${dm ? 'text-moon-silver' : 'text-gray-600'}`}>
                  The wobbler that dances on your desk, window, or shelf —
                  using only ambient light. No batteries. No cords. Just endless, meditative motion.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <motion.a
                    href="#products"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-full shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all min-h-[52px]"
                  >
                    Order Now <FiArrowRight className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href="#how-it-works"
                    whileHover={{ scale: 1.02 }}
                    className={`inline-flex items-center justify-center gap-2 px-8 py-4 border-2 font-bold rounded-full transition-all min-h-[52px] ${
                      dm ? 'border-moon-silver/30 text-moon-silver hover:border-yellow-400 hover:text-yellow-400'
                        : 'border-gray-300 text-gray-700 hover:border-yellow-500 hover:text-yellow-600'
                    }`}
                  >
                    <FiZap className="w-4 h-4" /> How It Works
                  </motion.a>
                </div>

                <div className="flex flex-wrap gap-5">
                  {[
                    { Icon: FiZap, text: 'Zero Batteries Ever' },
                    { Icon: FiSun, text: 'Works in Room Light' },
                    { Icon: FiTruck, text: 'Fast BD Delivery' },
                  ].map((b) => (
                    <div key={b.text} className={`flex items-center gap-2 text-sm ${dm ? 'text-moon-silver' : 'text-gray-500'}`}>
                      <b.Icon className="w-4 h-4 text-yellow-500" /> {b.text}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Hero Visual — CSS orbital ring + animated sun icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="relative hidden lg:flex items-center justify-center"
                style={{ minHeight: '400px' }}
              >
                {/* Glow blob */}
                <div className="absolute w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl" />
                {/* Slow dashed orbit ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-72 h-72 rounded-full border border-dashed border-yellow-400/30"
                />
                {/* Fast solid inner ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                  className="absolute w-48 h-48 rounded-full border border-yellow-300/20"
                />
                {/* Central sun icon */}
                <motion.div
                  animate={{ scale: [1, 1.08, 1], opacity: [0.9, 1, 0.9] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-10"
                >
                  <div className="w-36 h-36 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-yellow-500/50">
                    <FiSun className="w-20 h-20 text-white" strokeWidth={1.5} />
                  </div>
                </motion.div>
                {/* Orbiting dots */}
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <motion.div
                    key={deg}
                    className="absolute w-3 h-3 rounded-full bg-yellow-400"
                    style={{
                      left: `calc(50% + ${Math.cos((deg * Math.PI) / 180) * 140}px)`,
                      top: `calc(50% + ${Math.sin((deg * Math.PI) / 180) * 140}px)`,
                    }}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: deg / 300 }}
                  />
                ))}
              </motion.div>
            </div>
          </div>

          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <FiChevronDown className={`w-6 h-6 ${dm ? 'text-moon-silver/50' : 'text-gray-400'}`} />
          </motion.div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className={`py-16 sm:py-24 ${dm ? 'bg-moon-midnight/60' : 'bg-yellow-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-14">
                <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${dm ? 'text-white' : 'text-gray-900'}`}>
                  How It <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">Works</span>
                </h2>
                <p className={`max-w-xl mx-auto ${dm ? 'text-moon-silver' : 'text-gray-600'}`}>Three steps from unboxing to non-stop vibing.</p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {HOW_IT_WORKS.map((step, i) => (
                <ScrollReveal key={step.step} delay={i * 0.15}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    className={`relative p-8 rounded-2xl text-center transition-all ${
                      dm ? 'bg-moon-space/60 border border-moon-silver/10 hover:border-yellow-400/30'
                        : 'bg-white shadow-md hover:shadow-xl border border-yellow-100'
                    }`}
                  >
                    <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white ${dm ? 'bg-yellow-500' : 'bg-orange-500'}`}>
                      {step.step}
                    </div>
                    {/* SVG icon in gradient ring */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-5 mt-2`}>
                      <step.Icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                    </div>
                    <h3 className={`text-xl font-bold mb-3 ${dm ? 'text-white' : 'text-gray-900'}`}>{step.title}</h3>
                    <p className={dm ? 'text-moon-silver' : 'text-gray-600'}>{step.desc}</p>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCT GRID */}
        <section id="products" className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${dm ? 'text-white' : 'text-gray-900'}`}>
                  Shop <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">Wobblers</span>
                </h2>
                <p className={`max-w-xl mx-auto ${dm ? 'text-moon-silver' : 'text-gray-600'}`}>Every one is hand-picked. Every one vibes.</p>
              </div>
            </ScrollReveal>

            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(4)].map((_, i) => <ProductSkeleton key={i} darkMode={dm} />)}
              </div>
            )}

            {!loading && error && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <FiAlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className={`text-xl font-bold mb-4 ${dm ? 'text-white' : 'text-gray-900'}`}>{error}</h3>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-full hover:shadow-lg transition-all"
                >
                  Try Again
                </button>
              </motion.div>
            )}

            {!loading && !error && products.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-yellow-500/30"
                >
                  <FiSun className="w-12 h-12 text-white" strokeWidth={1.5} />
                </motion.div>
                <h3 className={`text-2xl font-bold mb-3 ${dm ? 'text-white' : 'text-gray-900'}`}>Coming Soon — Get Ready to Vibe!</h3>
                <p className={`mb-8 max-w-md mx-auto ${dm ? 'text-moon-silver' : 'text-gray-600'}`}>
                  Our first Solar Wobbler collection is almost here. Check back soon!
                </p>
                <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-full hover:shadow-lg transition-all">
                  Browse All Products
                </Link>
              </motion.div>
            )}

            {!loading && !error && products.length > 0 && (
              <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                  <StaggerItem key={product._id}>
                    <WobblerCard product={product} darkMode={dm} onBuy={handleBuy} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </section>

        {/* WHY SOLAR WOBBLER */}
        <ScrollReveal>
          <section className={`py-16 sm:py-20 ${dm ? 'bg-moon-midnight/60' : 'bg-orange-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${dm ? 'text-white' : 'text-gray-900'}`}>Why the Solar Wobbler?</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { Icon: FiZap, color: 'from-yellow-500 to-amber-500', title: 'Zero Batteries', desc: 'Runs entirely on light. Never needs charging or replacement batteries.' },
                  { Icon: FiVolume2, color: 'from-blue-500 to-indigo-500', title: 'Silent Motion', desc: 'The micro-motor is whisper-quiet. Perfect for desks, libraries, and bedrooms.' },
                  { Icon: FiFilm, color: 'from-purple-500 to-pink-500', title: 'Living Art', desc: 'Unlike a still poster, the wobbler is always in motion. It breathes life into your space.' },
                  { Icon: FiDroplet, color: 'from-emerald-500 to-teal-500', title: 'Eco-Friendly', desc: 'No disposable batteries means no hazardous waste. Good vibes for the planet.' },
                ].map((f) => (
                  <motion.div
                    key={f.title}
                    whileHover={{ y: -4 }}
                    className={`p-7 rounded-2xl text-center transition-all ${
                      dm ? 'bg-moon-space/50 border border-moon-silver/10 hover:border-yellow-400/30'
                        : 'bg-white shadow-md hover:shadow-lg border border-orange-100'
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mx-auto mb-4`}>
                      <f.Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                    </div>
                    <h3 className={`text-lg font-bold mb-2 ${dm ? 'text-white' : 'text-gray-900'}`}>{f.title}</h3>
                    <p className={`text-sm ${dm ? 'text-moon-silver' : 'text-gray-600'}`}>{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* FAQ */}
        <section className="py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${dm ? 'text-white' : 'text-gray-900'}`}>Frequently Asked</h2>
                <p className={dm ? 'text-moon-silver' : 'text-gray-600'}>Everything you want to know about the Solar Wobbler.</p>
              </div>
            </ScrollReveal>
            <div className={`rounded-2xl overflow-hidden px-6 ${dm ? 'bg-moon-space/40 border border-moon-silver/10' : 'bg-white border border-gray-100 shadow-md'}`}>
              {FAQ.map((item) => <FAQItem key={item.q} item={item} darkMode={dm} />)}
            </div>
          </div>
        </section>

        {/* CROSS-SELL */}
        <ScrollReveal>
          <section className={`py-16 ${dm ? 'bg-moon-midnight/40' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <FiHeart className="w-5 h-5 text-red-400" />
                <span className={`font-semibold ${dm ? 'text-moon-silver' : 'text-gray-500'}`}>Complete Your Setup</span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-bold mb-3 ${dm ? 'text-white' : 'text-gray-900'}`}>Pair the Wobbler with a Poster</h2>
              <p className={`mb-8 max-w-lg mx-auto ${dm ? 'text-moon-silver' : 'text-gray-600'}`}>
                A Solar Wobbler on your desk, a VYBE poster on your wall. The perfect room setup.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
                <Link to="/products?category=motivational" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-vybe-purple text-white font-bold rounded-full hover:bg-vybe-purple/90 shadow-lg shadow-purple-500/30 transition-all">
                  <FiZap className="w-4 h-4" /> Motivational Posters
                </Link>
                <Link to="/products?category=abstract" className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 font-bold rounded-full transition-all ${dm ? 'border-moon-silver/30 text-moon-silver hover:border-vybe-purple hover:text-vybe-purple' : 'border-gray-300 text-gray-700 hover:border-vybe-purple hover:text-vybe-purple'}`}>
                  <FiFeather className="w-4 h-4" /> Abstract Art Posters
                </Link>
                <Link to="/home-decor" className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 font-bold rounded-full transition-all ${dm ? 'border-moon-silver/30 text-moon-silver hover:border-amber-400 hover:text-amber-400' : 'border-gray-300 text-gray-700 hover:border-amber-500 hover:text-amber-600'}`}>
                  <FiHome className="w-4 h-4" /> Home Decor Collection
                </Link>
              </div>
            </div>
          </section>
        </ScrollReveal>

      </div>
    </>
  );
}
