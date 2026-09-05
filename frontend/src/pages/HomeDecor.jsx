import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiArrowRight, FiStar, FiPackage, FiShield, FiTruck, FiAlertCircle, FiHome, FiWatch, FiImage, FiGrid, FiLayers, FiCoffee, FiFeather, FiZap } from 'react-icons/fi';
import { productsAPI } from '../api';
import { useCartStore } from '../store';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../components/PageTransition';

// Sub-category pill definitions
const SUB_CATEGORIES = [
  { value: '', label: 'All Home Decor', Icon: FiHome },
  { value: 'cushion-cover', label: 'Cushion Covers', Icon: FiLayers },
  { value: 'throw-pillow', label: 'Throw Pillows', Icon: FiZap },
  { value: 'wall-clock', label: 'Wall Clocks', Icon: FiWatch },
  { value: 'photo-frame', label: 'Photo Frames', Icon: FiImage },
  { value: 'canvas-print', label: 'Canvas Prints', Icon: FiGrid },
  { value: 'table-decor', label: 'Table Decor', Icon: FiCoffee },
];

// Clean product name helper (same pattern as Products.jsx)
const cleanProductName = (name) => {
  if (!name) return '';
  return name
    .replace(/\s*\|\|\s*#\d+/g, '')
    .replace(/\s*#\d+$/g, '')
    .replace(/\s*\(\d+\)$/g, '')
    .replace(/\s*-\s*\d+$/g, '')
    .replace(/^\d+\.\s*/g, '')
    .trim();
};

export default function HomeDecor() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addItem);

  // Skeleton card for loading state
  const ProductSkeleton = () => (
    <div className={`rounded-2xl overflow-hidden animate-pulse ${darkMode ? 'bg-moon-space/50' : 'bg-amber-50'}`}>
      <div className={`aspect-square ${darkMode ? 'bg-moon-midnight/60' : 'bg-amber-100'}`} />
      <div className="p-4 space-y-3">
        <div className={`h-4 rounded-full w-3/4 ${darkMode ? 'bg-moon-midnight/60' : 'bg-amber-100'}`} />
        <div className={`h-3 rounded-full w-1/2 ${darkMode ? 'bg-moon-midnight/60' : 'bg-amber-100'}`} />
        <div className={`h-10 rounded-xl ${darkMode ? 'bg-moon-midnight/60' : 'bg-amber-100'}`} />
      </div>
    </div>
  );

  // Theme sync
  useEffect(() => {
    const handleThemeChange = () => setDarkMode(localStorage.getItem('theme') === 'dark');
    window.addEventListener('storage', handleThemeChange);
    window.addEventListener('themeChange', handleThemeChange);
    return () => {
      window.removeEventListener('storage', handleThemeChange);
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  // Fetch products
  useEffect(() => {
    setPage(1);
    setProducts([]);
    setError(null);
    fetchProducts(1, activeCategory, true);
  }, [activeCategory]);

  const fetchProducts = async (pageNum, category, reset = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const params = {
        productType: 'home-decor',
        limit: 12,
        page: pageNum,
        sort: 'createdAt_desc',
        ...(category ? { category } : {}),
      };
      const res = await productsAPI.getAll(params);
      const data = res.data || res;
      const newProducts = data.products || data || [];
      const pagination = data.pagination || {};

      setProducts((prev) => reset ? newProducts : [...prev, ...newProducts]);
      setHasMore(pageNum < (pagination.totalPages || 1));
    } catch (err) {
      console.error('HomeDecor fetch error:', err);
      if (pageNum === 1) setError('Could not load products. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, activeCategory);
  };

  // Product card quick buy
  const handleQuickBuyNow = (product) => {
    // For home-decor with sizes, navigate to product detail
    if (product.sizes && product.sizes.length > 0) {
      navigate(`/products/${product._id}`);
    } else {
      // Single SKU — go straight to checkout
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
        <title>Home Decor Bangladesh — Cushion Covers, Wall Clocks & More | VYBE</title>
        <meta
          name="description"
          content="Premium home decor in Bangladesh. Shop cushion covers, wall clocks, photo frames & canvas prints. Fast delivery, secure checkout at VYBE."
        />
        <meta
          name="keywords"
          content="home decor bangladesh, cushion cover bd, wall clock dhaka, photo frame bd, canvas print bangladesh, home decoration online"
        />
        <link rel="canonical" href="https://vybebd.store/home-decor" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vybebd.store/home-decor" />
        <meta property="og:title" content="Home Decor Bangladesh | VYBE" />
        <meta property="og:description" content="Transform your living space with premium home decor. Shop cushion covers, wall clocks, photo frames & more." />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Home Decor | VYBE',
          description: 'Premium home decor products in Bangladesh',
          url: 'https://vybebd.store/home-decor',
        })}</script>
      </Helmet>

      <div className={`min-h-screen transition-colors duration-300 ${dm ? 'bg-gradient-to-br from-moon-midnight via-moon-space to-moon-midnight' : 'bg-white'}`}>

        {/* ── HERO BANNER ─────────────────────────────────────────────────── */}
        <section className="relative pt-24 pb-0 overflow-hidden">
          {/* Warm gradient background */}
          <div className={`absolute inset-0 ${dm ? 'bg-gradient-to-br from-amber-900/30 via-rose-900/20 to-moon-midnight' : 'bg-gradient-to-br from-amber-50 via-rose-50 to-white'}`} />

          {/* Decorative circles */}
          <div className="absolute top-20 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Hero Text */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-sm font-semibold rounded-full mb-6"
                >
                  🏠 New Collection
                </motion.span>

                <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 ${dm ? 'text-white' : 'text-gray-900'}`}>
                  Make Every Room{' '}
                  <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 bg-clip-text text-transparent">
                    Feel Like You
                  </span>
                </h1>

                <p className={`text-lg sm:text-xl mb-8 leading-relaxed ${dm ? 'text-moon-silver' : 'text-gray-600'}`}>
                  Premium cushion covers, wall clocks, photo frames & more.
                  Hand-curated pieces that transform your living space into your personal sanctuary.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.a
                    href="#products"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold rounded-full shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 min-h-[52px]"
                  >
                    Shop Now <FiArrowRight className="w-5 h-5" />
                  </motion.a>
                  <Link
                    to="/products?productType=home-decor"
                    className={`inline-flex items-center justify-center gap-2 px-8 py-4 border-2 font-bold rounded-full transition-all duration-300 min-h-[52px] ${dm ? 'border-moon-silver/30 text-moon-silver hover:border-amber-400 hover:text-amber-400' : 'border-gray-300 text-gray-700 hover:border-amber-500 hover:text-amber-600'}`}
                  >
                    View All
                  </Link>
                </div>

                {/* Trust micro-badges */}
                <div className="flex flex-wrap gap-4 mt-8">
                  {[
                    { icon: <FiTruck />, text: 'Dhaka ৳100 Delivery' },
                    { icon: <FiShield />, text: 'Secure Checkout' },
                    { icon: <FiPackage />, text: 'Premium Quality' },
                  ].map((b) => (
                    <div key={b.text} className={`flex items-center gap-2 text-sm ${dm ? 'text-moon-silver' : 'text-gray-500'}`}>
                      <span className="text-amber-500">{b.icon}</span>
                      {b.text}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Hero visual — animated icon stack */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                className="relative hidden md:flex justify-center items-center"
              >
                <div className="relative w-80 h-80">
                  {/* Back card */}
                  <motion.div
                    animate={{ rotate: [-6, -5, -6], y: [0, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #d97706, #be185d)' }}
                  >
                    <FiLayers className="w-24 h-24 text-white/80" strokeWidth={1} />
                  </motion.div>
                  {/* Mid card */}
                  <motion.div
                    animate={{ rotate: [3, 4, 3], y: [0, 5, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    className="absolute inset-4 rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}
                  >
                    <FiWatch className="w-20 h-20 text-white/80" strokeWidth={1} />
                  </motion.div>
                  {/* Front card */}
                  <motion.div
                    animate={{ rotate: [0, 1, 0], y: [0, -3, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute inset-8 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #fbbf24, #f97316)' }}
                  >
                    <FiImage className="w-14 h-14 text-white/80" strokeWidth={1} />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── CATEGORY PILLS ─────────────────────────────────────────────── */}
        <section className="py-8 sticky top-16 z-30 backdrop-blur-md border-b border-b-transparent" style={{ backgroundColor: dm ? 'rgba(10,14,39,0.9)' : 'rgba(255,255,255,0.9)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {SUB_CATEGORIES.map((cat) => (
                <motion.button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-none flex items-center gap-2 px-4 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap min-h-[44px] ${
                    activeCategory === cat.value
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md shadow-amber-500/30'
                      : dm
                        ? 'bg-moon-midnight/60 border border-moon-silver/20 text-moon-silver hover:border-amber-400/50 hover:text-amber-400'
                        : 'bg-gray-100 border border-gray-200 text-gray-600 hover:border-amber-400 hover:text-amber-600'
                  }`}
                >
                  <cat.Icon className="w-4 h-4" />
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRODUCT GRID ─────────────────────────────────────────────────── */}
        <section id="products" className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <FiAlertCircle className={`w-12 h-12 mx-auto mb-4 ${dm ? 'text-rose-400' : 'text-rose-500'}`} />
                <h3 className={`text-xl font-bold mb-3 ${dm ? 'text-white' : 'text-gray-900'}`}>{error}</h3>
                <button
                  onClick={() => { setError(null); fetchProducts(1, activeCategory, true); }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold rounded-full hover:shadow-lg transition-all"
                >
                  Try Again
                </button>
              </motion.div>
            ) : products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-24"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 flex items-center justify-center mx-auto mb-4">
                  <FiHome className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${dm ? 'text-white' : 'text-gray-900'}`}>
                  Home Decor Coming Soon!
                </h3>
                <p className={`mb-8 ${dm ? 'text-moon-silver' : 'text-gray-600'}`}>
                  We're curating beautiful pieces for your home. Check back soon!
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold rounded-full hover:shadow-lg transition-all"
                >
                  Browse Posters Instead
                </Link>
              </motion.div>
            ) : (
              <>
                <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {products.map((product) => (
                    <StaggerItem key={product._id}>
                      <HomeDecorCard
                        product={product}
                        darkMode={dm}
                        onBuyNow={handleQuickBuyNow}
                      />
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                {/* Load More */}
                {hasMore && (
                  <div className="text-center mt-12">
                    <motion.button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      aria-label={loadingMore ? 'Loading more products' : 'Load more home decor products'}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold rounded-full shadow-lg hover:shadow-amber-500/40 transition-all disabled:opacity-50"
                    >
                      {loadingMore ? (
                        <>
                          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>Load More <FiArrowRight /></>
                      )}
                    </motion.button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ── WHY VYBE HOME DECOR ─────────────────────────────────────────── */}
        <ScrollReveal>
          <section className={`py-16 sm:py-20 ${dm ? 'bg-moon-midnight/60' : 'bg-amber-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className={`text-3xl sm:text-4xl font-bold mb-4 ${dm ? 'text-white' : 'text-gray-900'}`}>
                  Why Choose <span className="text-amber-500">VYBE Home Decor</span>
                </h2>
                <p className={`max-w-2xl mx-auto ${dm ? 'text-moon-silver' : 'text-gray-600'}`}>
                  Every piece is hand-curated for quality, style, and that perfect vibe.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {[
                  {
                    Icon: FiStar,
                    color: 'from-amber-400 to-orange-500',
                    title: 'Premium Materials',
                    desc: 'High-quality fabric, wood, and glass. Every product feels luxurious.',
                  },
                  {
                    Icon: FiFeather,
                    color: 'from-purple-500 to-pink-500',
                    title: 'Curated Designs',
                    desc: 'Designs that complement any interior — from minimalist to maximalist.',
                  },
                  {
                    Icon: FiTruck,
                    color: 'from-emerald-500 to-teal-500',
                    title: 'Fast BD Delivery',
                    desc: 'Dhaka in 1–2 days. Outside Dhaka in 2–4 days. Always on time.',
                  },
                ].map((f) => (
                  <motion.div
                    key={f.title}
                    whileHover={{ y: -4 }}
                    className={`p-8 rounded-2xl text-center transition-all ${dm ? 'bg-moon-space/50 border border-moon-silver/10 hover:border-amber-400/30' : 'bg-white shadow-md hover:shadow-lg border border-amber-100'}`}
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mx-auto mb-4`}>
                      <f.Icon className="w-8 h-8 text-white" strokeWidth={1.5} />
                    </div>
                    <h3 className={`text-xl font-bold mb-3 ${dm ? 'text-white' : 'text-gray-900'}`}>{f.title}</h3>
                    <p className={`${dm ? 'text-moon-silver' : 'text-gray-600'}`}>{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── CROSS-SELL: COMPLETE THE LOOK ─────────────────────────────── */}
        <ScrollReveal>
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className={`text-2xl sm:text-3xl font-bold mb-3 ${dm ? 'text-white' : 'text-gray-900'}`}>
                Complete the Look
              </h2>
              <p className={`mb-8 ${dm ? 'text-moon-silver' : 'text-gray-600'}`}>
                Pair your home decor with a stunning wall poster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/products?category=abstract"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-vybe-purple text-white font-bold rounded-full hover:bg-vybe-purple/90 shadow-lg shadow-purple-500/30 transition-all"
                >
                  <FiFeather className="w-4 h-4" /> Browse Abstract Posters
                </Link>
                <Link
                  to="/products?category=minimalist"
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 font-bold rounded-full transition-all ${dm ? 'border-moon-silver/30 text-moon-silver hover:border-vybe-purple hover:text-vybe-purple' : 'border-gray-300 text-gray-700 hover:border-vybe-purple hover:text-vybe-purple'}`}
                >
                  <FiGrid className="w-4 h-4" /> Minimalist Posters
                </Link>
              </div>
            </div>
          </section>
        </ScrollReveal>

      </div>
    </>
  );
}

// ── HomeDecorCard ────────────────────────────────────────────────────────────
function HomeDecorCard({ product, darkMode: dm, onBuyNow }) {
  const [isHovered, setIsHovered] = useState(false);
  const imgUrl =
    product.images?.[0]?.urls?.medium ||
    product.images?.[0]?.urls?.thumbnail ||
    product.images?.[0]?.url ||
    '';
  const name = cleanProductName(product.name);
  const hasDiscount = product.originalPrice && product.originalPrice > product.basePrice;

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      className={`group relative rounded-2xl overflow-hidden transition-all duration-300 ${dm ? 'bg-moon-space/50 border border-moon-silver/10 hover:border-amber-400/30 hover:shadow-xl hover:shadow-amber-500/10' : 'bg-white border border-gray-100 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-500/10'}`}
    >
      {/* Image */}
      <Link to={`/products/${product._id}`} className="block relative overflow-hidden aspect-square">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${dm ? 'bg-moon-midnight' : 'bg-amber-50'}`}>
            <FiHome className="w-14 h-14 text-amber-300" strokeWidth={1} />
          </div>
        )}

        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {Math.round(((product.originalPrice - product.basePrice) / product.originalPrice) * 100)}% OFF
          </div>
        )}

        {/* New arrival badge */}
        {product.newArrival && !hasDiscount && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            NEW
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-3 sm:p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className={`font-semibold text-sm sm:text-base line-clamp-2 mb-1 hover:text-amber-600 transition-colors ${dm ? 'text-white' : 'text-gray-900'}`}>
            {name}
          </h3>
        </Link>

        {/* Short description — shown if available */}
        {product.shortDescription && (
          <p className={`text-xs line-clamp-1 mb-1.5 ${dm ? 'text-moon-silver/70' : 'text-gray-500'}`}>
            {product.shortDescription}
          </p>
        )}
        {/* Rating */}
        {product.rating?.count > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
            <span className={`text-xs ${dm ? 'text-moon-silver' : 'text-gray-500'}`}>
              {product.rating.average.toFixed(1)} ({product.rating.count})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base sm:text-lg font-bold text-amber-600">
            ৳{product.basePrice}
          </span>
          {hasDiscount && (
            <span className={`text-xs line-through ${dm ? 'text-moon-silver/50' : 'text-gray-400'}`}>
              ৳{product.originalPrice}
            </span>
          )}
        </div>

        {/* Buy Now CTA */}
        <motion.button
          onClick={() => onBuyNow(product)}
          whileTap={{ scale: 0.97 }}
          className="w-full py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:shadow-md hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 min-h-[44px]"
        >
          <FiShoppingCart className="w-4 h-4" />
          {product.sizes?.length > 0 ? 'Choose Options' : 'Buy Now'}
        </motion.button>
      </div>
    </motion.div>
  );
}
