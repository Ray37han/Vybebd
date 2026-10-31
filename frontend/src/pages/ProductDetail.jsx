import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiStar, FiX, FiZoomIn, FiImage, FiSun, FiTag, FiInfo, FiAlertTriangle, FiCheck, FiAlertCircle, FiCheckCircle, FiHome } from 'react-icons/fi';
import { productsAPI, cartAPI } from '../api';
import { useAuthStore, useCartStore } from '../store';
import { useAnalytics } from '../context/AnalyticsContext';
import { ScrollReveal } from '../components/PageTransition';
import LoadingStore from '../components/LoadingStore';
import { HeartButton } from '../components/AnimatedIcon';
import MagneticButton from '../components/MagneticButton';
import { TrustBanner } from '../components/TrustBadges';
import StickyAddToCart from '../components/StickyAddToCart';
import WobblerExtras from '../components/WobblerExtras';
import CompleteYourSpace from '../components/CompleteYourSpace';
import toast from 'react-hot-toast';
import { trackViewContent, trackAddToCart as pixelTrackAddToCart } from '../utils/metaPixel';

// ── Product UI Configuration (module-level) ───────────────────────────────────────
// Controls which variation selectors appear in ProductDetail based on product type.
// To add a new product type in the future, add one key here — zero other changes needed.
const PRODUCT_UI_CONFIG = {
  poster: {
    showTierSelector: true,
    showSizeSelector: true,
    showFrameSelector: true,
    sizeRequired: true,
    sizeLabel: 'Select Size',
    sizeHint: 'Tip: Select your preferred poster size to see the price',
    showCustomizeButton: true,
  },
  'home-decor': {
    showTierSelector: false,
    showSizeSelector: true,
    showFrameSelector: false,
    sizeRequired: true,
    sizeLabel: 'Select Option',
    sizeHint: 'Choose your preferred size or variant',
    showCustomizeButton: false,
  },
  wobbler: {
    showTierSelector: false,
    showSizeSelector: false,
    showFrameSelector: false,
    sizeRequired: false, // single SKU — no size selection needed
    sizeLabel: null,
    sizeHint: null,
    showCustomizeButton: false,
  },
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState('Standard');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedFrame, setSelectedFrame] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Default to light theme
  const priceRef = useRef(null); // For StickyAddToCart IntersectionObserver
  const { isAuthenticated } = useAuthStore();
  const addToCart = useCartStore((state) => state.addItem);
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setDarkMode(savedTheme === 'dark');

    const handleThemeChange = () => {
      const currentTheme = localStorage.getItem('theme');
      setDarkMode(currentTheme === 'dark');
    };

    window.addEventListener('storage', handleThemeChange);
    window.addEventListener('themeChange', handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleThemeChange);
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getOne(id);
      const productData = response.data || response;
      setProduct(productData);
      // Internal analytics
      trackEvent('product_view', {
        productId: productData._id,
        productName: productData.name,
        productCategory: productData.category,
      });
      // Meta Pixel ViewContent
      trackViewContent(productData);
    } catch (error) {
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    // Defensive check for product
    if (!product) {
      toast.error('Product not found');
      return;
    }

    // For products that don't require size (wobbler), skip size validation
    const needsSize = (PRODUCT_UI_CONFIG[product?.productType] || PRODUCT_UI_CONFIG.poster).sizeRequired;
    if (needsSize && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    try {
      // Always add to local cart first for immediate feedback
      addToCart({
        product,
        quantity,
        size: selectedSize || 'Standard',
        tier: selectedTier,
        frame: selectedFrame || 'No Frame',
        _id: Date.now().toString(),
      });

      // Internal analytics
      trackEvent('add_to_cart', {
        productId: product._id,
        productName: product.name,
        productCategory: product.category,
        quantity,
        price: product.basePrice,
      });

      // Meta Pixel AddToCart (debounce-guarded)
      pixelTrackAddToCart(product, quantity);

      console.log('Added to local cart');
      toast.success(<span><FiCheckCircle className="inline mr-2" /> Added to cart!</span>);

      // Then sync with backend if authenticated (don't block on this)
      if (isAuthenticated) {
        const cartItem = {
          productId: product._id,
          quantity,
          size: selectedSize,
          tier: selectedTier,
          frame: selectedFrame || 'No Frame',
        };

        try {
          await cartAPI.add(cartItem);
          console.log('Synced with backend');
        } catch (apiError) {
          console.warn('Failed to sync with backend, but item is in local cart:', apiError);
          // Don't show error to user - local cart is updated successfully
        }
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error(<span><FiAlertCircle className="inline mr-2" /> Failed to add to cart</span>);
    }
  };

  /**
   * Buy Now - Add to cart and go directly to checkout
   * Skips the cart page for faster purchase flow
   * For single-SKU products (wobbler, sizeRequired=false), skips size selection.
   */
  const handleBuyNow = () => {
    const needsSize = (PRODUCT_UI_CONFIG[product?.productType] || PRODUCT_UI_CONFIG.poster).sizeRequired;
    if (needsSize && !selectedSize) {
      toast.error('Please select a size first');
      return;
    }

    const isWobbler = product?.productType === 'wobbler';

    // Build a descriptive label
    const productLabel = isWobbler
      ? product.name
      : selectedTier && selectedTier !== 'Standard'
        ? `${product.name} – ${selectedSize} (${selectedTier})`
        : `${product.name} – ${selectedSize}`;

    const qs = new URLSearchParams({
      productId: product._id,
      name:      productLabel,
      price:     String(currentPrice),
      qty:       String(quantity),
      size:      selectedSize || 'Standard',
      frame:     selectedFrame || 'No Frame',
    });

    const buyNowImageUrl =
      product.images?.[selectedImage]?.urls?.large ||
      product.images?.[selectedImage]?.urls?.medium ||
      product.images?.[selectedImage]?.url ||
      product.images?.[0]?.urls?.large ||
      product.images?.[0]?.urls?.medium ||
      product.images?.[0]?.url ||
      '';

    if (buyNowImageUrl) qs.set('image', buyNowImageUrl);

    navigate(`/quick-checkout?${qs.toString()}`);
  };

  if (loading) {
    return <LoadingStore text="Loading product details" />;
  }

  if (!product) return null;

  const uiConfig = PRODUCT_UI_CONFIG[product.productType] || PRODUCT_UI_CONFIG.poster;
  const isWobbler = product.productType === 'wobbler';
  const isHomeDecor = product.productType === 'home-decor' || product.productType === 'wobbler';

  const productImageUrl = product.images?.[0]?.urls?.large || product.images?.[0]?.urls?.medium || product.images?.[0]?.url;
  const productUrl = `https://vybebd.store/products/${product._id}`;

  // SEO description — product-type-aware
  const productDesc = isWobbler
    ? `Buy ${product.name} in Bangladesh. Solar-powered kinetic wobbler — no batteries, just light. Fast delivery, secure checkout at vybebd.store.`
    : isHomeDecor
    ? `Buy ${product.name} in Bangladesh. ${(product.shortDescription || product.description || '').slice(0, 130)}. Fast delivery, secure checkout at vybebd.store`
    : `Buy ${product.name} poster in Bangladesh. ${(product.description || '').slice(0, 130)}. Fast delivery, secure checkout at vybebd.store`;

  // Guard: only compute size/tier pricing if product has a sizes array
  const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;

  const currentStdVariant = hasSizes
    ? product.sizes.find((s) => s.name === selectedSize && (s.tier || 'Standard') === 'Standard')
    : null;
  const currentPremVariant = hasSizes
    ? product.sizes.find((s) => s.name === selectedSize && s.tier === 'Premium')
    : null;
  const currentVariant = selectedTier === 'Premium'
    ? currentPremVariant || (currentStdVariant ? {
        ...currentStdVariant,
        price: currentStdVariant.price + (({ A5: 100, A4: 150, A3: 200 })[selectedSize] || 100),
      } : null)
    : currentStdVariant;
  const currentPrice = currentVariant?.price || product.basePrice;
  const currentOriginalPrice =
    currentVariant?.originalPrice || product.originalPrice || Math.round(currentPrice / 0.75);

  const uniqueAvailableSizes = hasSizes ? Array.from(new Set(product.sizes.map((s) => s.name))) : [];
  const premiumMarkup = { A5: 100, A4: 150, A3: 200 };


  return (
    <div className={`pt-24 pb-12 min-h-screen transition-colors duration-300 ${darkMode ? 'bg-moon-night' : 'bg-white'}`}>
      <Helmet>
        <title>{isWobbler ? `${product.name} | Solar Wobbler Bangladesh | VYBE` : isHomeDecor ? `${product.name} | Home Decor Bangladesh | VYBE` : `${product.name} | Buy Poster Online Bangladesh | VYBE`}</title>
        <meta name="description" content={productDesc} />
        <meta name="keywords" content={isWobbler
          ? `${product.name}, solar wobbler bangladesh, kinetic art bd, solar toy dhaka, desk decor, solar powered toy${product.tags?.length ? ', ' + product.tags.join(', ') : ''}`
          : isHomeDecor
          ? `${product.name}, home decor bangladesh, wall decor bd, buy home decor online${product.tags?.length ? ', ' + product.tags.join(', ') : ''}`
          : `${product.name}, ${product.category} poster, wall art bangladesh, poster bd, buy poster online${product.tags?.length ? ', ' + product.tags.join(', ') : ''}`
        } />
        <link rel="canonical" href={productUrl} />

        {/* Open Graph — product image shows when shared on WhatsApp/Facebook */}
        <meta property="og:type" content="product" />
        <meta property="og:url" content={productUrl} />
        <meta property="og:title" content={`${product.name} | VYBE`} />
        <meta property="og:description" content={(product.description || '').slice(0, 200)} />
        {productImageUrl && <meta property="og:image" content={productImageUrl} />}
        <meta property="og:site_name" content="VYBE" />
        <meta property="product:price:amount" content={String(product.basePrice)} />
        <meta property="product:price:currency" content="BDT" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} | VYBE`} />
        <meta name="twitter:description" content={(product.description || '').slice(0, 200)} />
        {productImageUrl && <meta name="twitter:image" content={productImageUrl} />}

        {/* JSON-LD Product Schema — Google rich snippets: stars + price in search results */}
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: product.images?.map(img => img.urls?.large || img.urls?.medium || img.url).filter(Boolean),
          sku: product._id,
          brand: { '@type': 'Brand', name: 'VYBE' },
          offers: {
            '@type': 'Offer',
            url: productUrl,
            priceCurrency: 'BDT',
            price: product.basePrice,
            priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            availability: (product.stock || 0) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            seller: { '@type': 'Organization', name: 'VYBE' },
          },
          ...(product.rating?.count > 0 ? {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: product.rating.average,
              reviewCount: product.rating.count,
              bestRating: 5,
              worstRating: 1,
            },
          } : {}),
        })}</script>

        {/* BreadcrumbList Schema */}
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vybebd.store' },
            { '@type': 'ListItem', position: 2, name: product.category || 'Posters', item: `https://vybebd.store/products${product.category ? `?category=${product.category}` : ''}` },
            { '@type': 'ListItem', position: 3, name: product.name, item: productUrl },
          ],
        })}</script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative card overflow-hidden mb-4 group cursor-pointer"
              onClick={() => setIsZoomed(true)}
            >
              <img
                src={product.images[selectedImage]?.urls?.large || product.images[selectedImage]?.url}
                alt={product.name}
                loading="eager"
                fetchpriority="high"
                decoding="async"
                className="w-full h-auto object-contain max-h-[600px]"
                style={{ 
                  aspectRatio: 'auto',
                  width: '100%',
                  height: 'auto'
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                  <FiZoomIn className="w-5 h-5" />
                  <span className="text-sm font-medium">Click to zoom</span>
                </div>
              </div>
            </motion.div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4" role="tablist" aria-label="Product image thumbnails">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    role="tab"
                    aria-selected={selectedImage === idx}
                    aria-label={`View image ${idx + 1} of ${product.images.length}`}
                    onClick={() => setSelectedImage(idx)}
                    className={`card overflow-hidden transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vybe-purple ${
                      selectedImage === idx ? 'ring-2 ring-vybe-purple' : ''
                    }`}
                  >
                    <img src={img.urls?.thumbnail || img.url} alt={`${product.name} — view ${idx + 1}`} loading="lazy" className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            {/* Product-type-aware promo badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`inline-flex items-center gap-2 mb-4 px-4 py-2 font-bold rounded-full shadow-lg text-white ${
                isWobbler
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                  : isHomeDecor
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600'
              }`}
            >
              {isWobbler ? (
                <><FiSun className="w-4 h-4" /> Solar Powered · Zero Batteries</>
              ) : isHomeDecor ? (
                <><FiHome className="w-4 h-4" /> Home Decor · Premium Quality</>
              ) : (
                <><FiTag className="w-4 h-4" /> 25% OFF — Limited Time</>
              )}
            </motion.div>
            <h1 className={`text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{product.name}</h1>
            <div className="flex items-center mb-4">
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating?.average || 0) ? 'fill-current' : ''
                    }`}
                  />
                ))}
              </div>
              <span className={`ml-2 ${darkMode ? 'text-moon-silver/70' : 'text-gray-600'}`}>
                {(product.rating?.average || 0).toFixed(1)} ({product.rating?.count || 0} reviews)
              </span>
            </div>
            
            {/* Price display — type-aware: wobbler/sizeless home-decor = flat price, posters = size-dependent */}
            <div ref={priceRef} className="flex items-center gap-4 mb-4">
              {(isWobbler || (isHomeDecor && !hasSizes)) ? (
                /* Single-SKU products: show base price directly */
                <>
                  <p className={`text-4xl font-bold ${isWobbler ? 'text-orange-500' : 'text-amber-600'}`}>৳{product.basePrice}</p>
                  {product.originalPrice && product.originalPrice > product.basePrice && (
                    <div className="flex flex-col">
                      <span className={`text-xl line-through ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>৳{product.originalPrice}</span>
                      <span className="text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                        {Math.round(((product.originalPrice - product.basePrice) / product.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                  )}
                </>
              ) : selectedSize ? (
                <>
                  <p className="text-4xl font-bold text-vybe-purple">৳{currentPrice}</p>
                  <div className="flex flex-col">
                    <span className={`text-2xl line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>৳{currentOriginalPrice}</span>
                    <span className="text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                      25% OFF
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <p className={`text-3xl font-bold ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>৳{product.basePrice}+</p>
                  <span className={`text-sm px-3 py-1 rounded-full ${darkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-gray-100'}`}>
                    Starting price
                  </span>
                </div>
              )}
            </div>

            {/* Stock availability indicator — wobbler and sizeless home-decor */}
            {(isWobbler || (isHomeDecor && !hasSizes)) && (
              <div className="flex items-center gap-2 mb-5">
                {(product.stock > 0 || product.stock === undefined) ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                      In Stock — Ships within 2–3 days
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="text-sm font-semibold text-red-500">Out of Stock</span>
                  </>
                )}
              </div>
            )}

            <p className={`mb-6 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{product.description}</p>

            {/* Tier Selection — poster only */}
            {uiConfig.showTierSelector && (
            <div className="mb-6">
              <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-moon-silver' : 'text-gray-900'}`}>Quality:</label>
              <div className={`relative flex rounded-xl p-1 gap-1 ${darkMode ? 'bg-moon-night/60' : 'bg-gray-100'}`}>
                {['Standard', 'Premium'].map((tier) => (
                  <motion.button
                    key={tier}
                    onClick={() => { setSelectedTier(tier); setSelectedSize(''); }}
                    whileTap={{ scale: 0.95, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
                    className="relative flex-1 py-2.5 rounded-lg font-bold text-sm z-10"
                  >
                    {selectedTier === tier && (
                      <motion.span
                        layoutId="tierHighlight"
                        className={`absolute inset-0 rounded-lg shadow-md ${darkMode ? 'bg-moon-midnight' : 'bg-white'}`}
                        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      />
                    )}
                    <span className={`relative z-10 transition-colors duration-200 ${
                      selectedTier === tier
                        ? darkMode ? 'text-moon-gold' : 'text-vybe-purple'
                        : darkMode ? 'text-moon-silver/60' : 'text-gray-500'
                    }`}>
                      {tier}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
            )}

            {/* Size Selection — shown for poster and home-decor, not wobbler */}
            {uiConfig.showSizeSelector && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className={`text-sm font-semibold ${darkMode ? 'text-moon-silver' : 'text-gray-900'}`}>{uiConfig.sizeLabel}: <span className="text-red-500">*</span></label>
                {!selectedSize && (
                  <motion.span 
                    className="text-xs text-vybe-purple font-semibold flex items-center gap-1"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="w-2 h-2 bg-vybe-purple rounded-full animate-pulse-gpu"></span>
                    Please choose a size
                  </motion.span>
                )}
              </div>
              <div className={`flex flex-wrap gap-3 p-4 rounded-lg border-2 transition-all ${
                !selectedSize 
                  ? 'border-vybe-purple/30 bg-vybe-purple/5 shadow-lg shadow-vybe-purple/10' 
                  : 'border-transparent bg-transparent'
              }`}>
                {uniqueAvailableSizes.map((sizeName, sizeIdx) => {
                  const standardVariant = hasSizes ? product.sizes.find(
                    (s) => s.name === sizeName && (s.tier || 'Standard') === 'Standard'
                  ) : null;
                  const premiumVariantFromDB = hasSizes ? product.sizes.find(
                    (s) => s.name === sizeName && s.tier === 'Premium'
                  ) : null;
                  const sizeVariant = selectedTier === 'Premium'
                    ? premiumVariantFromDB || (standardVariant ? {
                        ...standardVariant,
                        price: standardVariant.price + (premiumMarkup[sizeName] || 100),
                        originalPrice: Math.round((standardVariant.price + (premiumMarkup[sizeName] || 100)) / 0.75)
                      } : null)
                    : standardVariant;
                  if (!sizeVariant) return null;
                  const flameDelay = sizeIdx * 0.3;
                  const isPremium = uiConfig.showTierSelector && selectedTier === 'Premium';
                  const isSelected = selectedSize === sizeName;

                  return (
                  <motion.button
                    key={`${selectedTier}-${sizeName}`}
                    onClick={() => setSelectedSize(sizeName)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92, transition: { type: 'spring', stiffness: 500, damping: 18 } }}
                    animate={isPremium && !isSelected ? {
                      borderColor: ['rgb(253,186,116)', 'rgb(249,115,22)', 'rgb(239,68,68)', 'rgb(249,115,22)', 'rgb(253,186,116)'],
                      boxShadow: ['0 0 4px rgba(249,115,22,0.2)', '0 0 18px rgba(249,115,22,0.55)', '0 0 4px rgba(249,115,22,0.2)']
                    } : {}}
                    transition={{ duration: 1.8, repeat: isPremium ? Infinity : 0, ease: 'easeInOut', delay: flameDelay }}
                    className={`relative px-6 py-3 rounded-full border-2 transition-all ${
                      isSelected
                        ? isPremium
                          ? 'border-orange-400 bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg shadow-orange-400/40'
                          : 'border-vybe-purple bg-vybe-purple text-white shadow-lg'
                        : isPremium
                          ? 'border-orange-300 hover:shadow-md'
                          : darkMode
                            ? 'border-moon-gold/30 text-moon-silver hover:border-moon-gold hover:shadow-md'
                            : 'border-gray-300 hover:border-vybe-purple hover:shadow-md'
                    }`}
                  >
                    {isPremium && (
                      <motion.span
                        className="absolute -top-3 -right-1 text-base leading-none pointer-events-none"
                        animate={{ y: [0, -4, 0], scale: [1, 1.3, 1], rotate: [-8, 8, -8] }}
                        transition={{ duration: 1.0, repeat: Infinity, ease: 'easeInOut', delay: flameDelay }}
                      >
                        {/* Flame indicator for premium — SVG icon */}
                        <svg className="w-4 h-4 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2c0 0-4 4-4 8a4 4 0 0 0 8 0c0-1.5-.5-3-1.5-4C13.5 8 13 10 12 10c-1.1 0-2-.9-2-2 0-2 2-6 2-6z" />
                        </svg>
                      </motion.span>
                    )}
                    <div className="flex flex-col items-start">
                      <span className={`font-semibold ${!isSelected && !isPremium && darkMode ? 'text-moon-silver' : ''}`}>{sizeVariant.name}</span>
                      <div className="flex items-center gap-2 text-sm">
                        <span className={isSelected ? 'text-white font-bold' : isPremium ? 'text-orange-500 font-bold' : darkMode ? 'text-moon-gold font-bold' : 'text-vybe-purple font-bold'}>
                          ৳{sizeVariant.price}
                        </span>
                        <span className={`text-xs line-through opacity-60 ${darkMode && !isSelected ? 'text-moon-silver/50' : ''}`}>
                          ৳{sizeVariant.originalPrice || Math.round(sizeVariant.price / 0.75)}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                  );
                })}              </div>
              {!selectedSize && uiConfig.sizeHint && (
                <motion.p 
                  className={`text-xs mt-2 flex items-center gap-1 ${darkMode ? 'text-moon-silver/60' : 'text-gray-500'}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <FiInfo className="w-3.5 h-3.5 flex-none" />
                  {uiConfig.sizeHint}
                </motion.p>
              )}
            </div>
            )}

            {/* Frame Selection — poster only */}
            {uiConfig.showFrameSelector && (
            <div className="mb-6">
              <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-moon-silver' : 'text-gray-900'}`}>
                Choose Frame: <span className={`text-xs ${darkMode ? 'text-moon-silver/50' : 'text-gray-500'}`}>(Optional)</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'black', label: 'Black', color: 'bg-black', textColor: 'text-white', ring: 'ring-gray-800' },
                  { value: 'white', label: 'White', color: 'bg-white border-2 border-gray-300', textColor: 'text-gray-900', ring: 'ring-gray-300' },
                  { value: 'woody', label: 'Woody', color: 'bg-gradient-to-br from-amber-700 to-amber-900', textColor: 'text-white', ring: 'ring-amber-700' }
                ].map((frame) => (
                  <motion.button
                    key={frame.value}
                    onClick={() => setSelectedFrame(frame.value)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative p-4 rounded-xl transition-all ${frame.color} ${
                      selectedFrame === frame.value
                        ? `ring-4 ${frame.ring || 'ring-vybe-purple'} shadow-lg`
                        : 'hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-12 h-12 rounded-lg ${frame.color} flex items-center justify-center`}>
                        {selectedFrame === frame.value && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                      <span className={`text-sm font-semibold ${frame.textColor}`}>
                        {frame.label}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
              <p className={`text-xs mt-2 ${darkMode ? 'text-moon-silver/60' : 'text-gray-500'}`}>
                {selectedFrame
                  ? (
                    <span className="flex items-center gap-1">
                      <FiCheck className="w-3 h-3 text-green-500" />
                      {selectedFrame.charAt(0).toUpperCase() + selectedFrame.slice(1)} frame selected
                    </span>
                  )
                  : 'Poster only (no frame)'}
              </p>
            </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-moon-silver' : 'text-gray-900'}`} id="qty-label">Quantity:</label>
              <div className="flex items-center gap-3" role="group" aria-labelledby="qty-label">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className={`w-12 h-12 rounded-lg border-2 font-bold text-xl transition-all flex items-center justify-center ${
                    quantity <= 1
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'border-vybe-purple text-vybe-purple hover:bg-vybe-purple hover:text-white active:scale-95'
                  }`}
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  aria-label="Quantity"
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setQuantity(Math.max(1, val));
                  }}
                  className={`w-20 h-12 text-center text-xl font-semibold border-2 rounded-lg focus:outline-none ${darkMode ? 'bg-moon-midnight border-moon-gold/30 text-moon-silver focus:border-moon-gold' : 'bg-white border-gray-300 text-gray-900 focus:border-vybe-purple'}`}
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                  className="w-12 h-12 rounded-lg border-2 border-vybe-purple text-vybe-purple hover:bg-vybe-purple hover:text-white font-bold text-xl transition-all flex items-center justify-center active:scale-95"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {/* Customize Button — poster only, Coming Soon */}
              {uiConfig.showCustomizeButton && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 cursor-not-allowed opacity-60 ${
                  darkMode
                    ? 'bg-moon-midnight border-2 border-moon-silver/30 text-moon-silver'
                    : 'bg-gray-100 border-2 border-gray-300 text-gray-500'
                }`}
              >
                <FiImage className="text-xl" />
                <span>Customize This Poster</span>
                <span className={`text-sm font-normal ${darkMode ? 'text-moon-gold' : 'text-purple-600'}`}>
                  (Coming Soon...)
                </span>
              </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 w-full">
                {/* Add to Cart Button */}
                <button 
                  onClick={() => {
                    setIsAdded(true);
                    handleAddToCart();
                    setTimeout(() => {
                      setIsAdded(false);
                    }, 2500);
                  }}
                  disabled={uiConfig.sizeRequired && !selectedSize}
                  className={`btn-cart flex-1 ${uiConfig.sizeRequired && !selectedSize ? 'opacity-50 cursor-not-allowed' : ''} ${isAdded ? 'active' : ''}`}
                >
                  <span>
                    <span className="flex items-center justify-center gap-2">
                      <FiShoppingCart />
                      {uiConfig.sizeRequired && !selectedSize ? 'Select Option' : 'Add to Cart'}
                    </span>
                  </span>
                </button>

                {/* Buy Now Button */}
                <motion.button
                  onClick={handleBuyNow}
                  disabled={uiConfig.sizeRequired && !selectedSize}
                  whileHover={(!uiConfig.sizeRequired || selectedSize) ? { scale: 1.02 } : {}}
                  whileTap={(!uiConfig.sizeRequired || selectedSize) ? { scale: 0.98 } : {}}
                  className={`flex-1 px-6 py-4 rounded-lg font-bold text-white transition-all ${
                    uiConfig.sizeRequired && !selectedSize
                      ? 'bg-gray-400 cursor-not-allowed opacity-50'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {uiConfig.sizeRequired && !selectedSize ? 'Select Option' : 'Buy Now'}
                  </span>
                </motion.button>
              </div>
            </div>
            
            {/* Trust Banner - Critical for BD market conversion */}
            <TrustBanner darkMode={darkMode} />

            {uiConfig.sizeRequired && !selectedSize && (
              <motion.div
                className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="flex items-center gap-2">
                  <FiAlertTriangle className="w-4 h-4 flex-none" />
                  Please select an option above to add this product to your cart
                </span>
              </motion.div>
            )}

            {product.customizable && (
              <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-moon-midnight/50 border border-moon-gold/30' : 'bg-yellow-50 border border-yellow-200'}`}>
                <p className={`text-sm ${darkMode ? 'text-moon-gold' : 'text-yellow-800'}`}>
                  <span className="flex items-center gap-2">
                    <FiImage className="w-4 h-4 flex-none" />
                    Customization feature coming soon! You'll be able to upload your own images and create personalized posters.
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Add to Cart — mobile conversion optimizer */}
      <StickyAddToCart
        product={product}
        selectedSize={!uiConfig.sizeRequired ? 'Standard' : selectedSize}
        currentPrice={currentPrice}
        onAddToCart={() => {
          setIsAdded(true);
          handleAddToCart();
          setTimeout(() => setIsAdded(false), 2500);
        }}
        disabled={uiConfig.sizeRequired && !selectedSize}
        needsSize={uiConfig.sizeRequired}
        darkMode={darkMode}
        targetRef={priceRef}
      />

      {/* Below-fold Wobbler-specific content */}
      {isWobbler && <WobblerExtras product={product} darkMode={darkMode} />}

      {/* Cross-sell: poster pages show Wobbler teaser; wobbler pages handled in WobblerExtras */}
      {!isWobbler && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <CompleteYourSpace productType={product.productType || 'poster'} darkMode={darkMode} />
        </div>
      )}
      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-3 rounded-full transition-all"
            >
              <FiX className="w-6 h-6" />
            </button>
            
            <div className="absolute top-4 left-4 z-50 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
              {selectedImage + 1} / {product.images.length}
            </div>

            {/* Navigation arrows */}
            {product.images.length > 1 && (
              <>
                {selectedImage > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(selectedImage - 1);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-4 rounded-full transition-all z-50"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                {selectedImage < product.images.length - 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(selectedImage + 1);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white p-4 rounded-full transition-all z-50"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </>
            )}

            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={product.images[selectedImage]?.urls?.full || product.images[selectedImage]?.url}
                alt={product.name}
                decoding="async"
                className="max-w-full max-h-full object-contain rounded-lg"
                style={{
                  width: 'auto',
                  height: 'auto',
                  maxWidth: '100%',
                  maxHeight: '90vh'
                }}
              />
            </motion.div>

            {/* Thumbnail navigation */}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-sm p-2 rounded-full">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    aria-label={`View image ${idx + 1}`}
                    aria-pressed={selectedImage === idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(idx);
                    }}
                    className={`w-16 h-16 rounded-lg overflow-hidden transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                      selectedImage === idx 
                        ? 'ring-2 ring-white scale-110' 
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.urls?.thumbnail || img.url} alt={`${product.name} — image ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
              Scroll to zoom • Click outside to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
