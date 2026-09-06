import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiSun, FiZap, FiCheck } from 'react-icons/fi';

// Import optimized images (modern WebP format)
import solarWobblerMonkeyImg from './images/SOLAR_WOBBLER_MONKEY.webp';
import solarWobblerBearImg from './images/SOLAR_WOBBLER_BEAR.webp';
import footballImg from './images/FOOTBALL.webp';
import gamesImg from './images/GAMES.webp';
import geminiImg from './images/gemini.webp';

/**
 * Real Solar Wobbler product variants from authentic photography
 * Captures the actual products in natural window sunlight on Tagore's books.
 */
const WOBBLER_VARIANTS = [
  {
    id: 'monkey',
    name: 'Monkey Edition',
    badge: '🐒 Monkey Edition',
    tagline: 'Holding a banana & peace sign',
    image: solarWobblerMonkeyImg,
    accent: 'from-amber-500 to-yellow-500',
  },
  {
    id: 'bear',
    name: 'Sunny Bear Edition',
    badge: '🐻 Sunny Bear',
    tagline: 'With signature spectacles',
    image: solarWobblerBearImg,
    accent: 'from-yellow-400 to-orange-500',
  },
];

const slides = [
  {
    id: 'solar-wobbler',
    isSpecial: true,
    badge: '☀️ 100% REAL LIGHT POWERED · ZERO BATTERIES',
    badgeColor: 'bg-gradient-to-r from-amber-500/30 to-yellow-500/20 text-amber-300 border border-amber-400/40',
    title: 'Meet Solar Wobbler.',
    highlight: 'Powered by Light.',
    highlightGradient: 'from-amber-300 via-yellow-400 to-orange-500',
    subtitle: 'Endless, hypnotic kinetic art for your desk or window sill. Placed in natural sunlight or under a room lamp, it rocks continuously — zero batteries, zero charging.',
    cta: 'Explore Solar Wobbler',
    ctaLink: '/solar-wobbler',
    secondaryCta: 'Order Direct',
    secondaryCtaLink: '/solar-wobbler#products',
    features: ['100% Light Powered', 'Zero Batteries Ever', 'Silent Swaying Motion', 'Living Kinetic Art'],
  },
  {
    id: 1,
    isSpecial: false,
    title: 'Turn Your Walls Into',
    highlight: 'Vibes',
    highlightGradient: 'from-purple-400 to-pink-400',
    subtitle: 'Premium posters that speak your language. Made in Bangladesh, made for you.',
    cta: 'Shop Now',
    ctaLink: '/products',
    secondaryCta: 'Custom Poster',
    secondaryCtaLink: '/products?category=custom',
    image: footballImg,
    gradient: 'from-purple-900/90 via-purple-900/70 to-transparent',
  },
  {
    id: 2,
    isSpecial: false,
    title: 'Your Passion,',
    highlight: 'Your Wall',
    highlightGradient: 'from-purple-400 to-pink-400',
    subtitle: 'From Anime to Football — find art that defines you.',
    cta: 'Explore Collections',
    ctaLink: '/products',
    secondaryCta: 'Custom Poster',
    secondaryCtaLink: '/products?category=custom',
    image: gamesImg,
    gradient: 'from-indigo-900/90 via-indigo-900/70 to-transparent',
  },
  {
    id: 3,
    isSpecial: false,
    title: 'Create Your Own',
    highlight: 'Masterpiece',
    highlightGradient: 'from-pink-400 to-rose-400',
    subtitle: 'Upload any image. We\'ll turn it into premium wall art.',
    cta: 'Start Creating',
    ctaLink: '/customize',
    secondaryCta: 'Custom Poster',
    secondaryCtaLink: '/products?category=custom',
    image: geminiImg,
    gradient: 'from-pink-900/90 via-pink-900/70 to-transparent',
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [activeWobblerIndex, setActiveWobblerIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance main carousel - resets when slide changes, pauses on hover or hidden tab
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7500);
    return () => clearInterval(timer);
  }, [currentSlide, isPaused]);

  // Auto-cycle wobbler variants when on the wobbler slide
  useEffect(() => {
    if (slides[currentSlide]?.isSpecial) {
      const wobblerTimer = setInterval(() => {
        setActiveWobblerIndex((prev) => (prev + 1) % WOBBLER_VARIANTS.length);
      }, 4000);
      return () => clearInterval(wobblerTimer);
    }
  }, [currentSlide]);

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];
  const activeWobbler = WOBBLER_VARIANTS[activeWobblerIndex];
  const otherWobblerIndex = (activeWobblerIndex + 1) % WOBBLER_VARIANTS.length;
  const otherWobbler = WOBBLER_VARIANTS[otherWobblerIndex];

  // Touch & Drag swipe support for mobile and desktop simulation
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const touchStartY = useRef(null);
  const touchEndY = useRef(null);
  const isSwiping = useRef(false);
  const isDragging = useRef(false);

  const handleTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
    isSwiping.current = false;
  };

  const handleTouchMove = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
    const diffX = touchStartX.current - touchEndX.current;
    if (Math.abs(diffX) > 10) {
      isSwiping.current = true;
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diffX = touchStartX.current - touchEndX.current;
    const diffY = touchStartY.current - touchEndY.current;
    const minSwipeDistance = 35;

    // Trigger slide change if horizontal swipe dominates vertical scrolling
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) {
        // Swiped left (finger moved right to left) -> Next slide
        nextSlide();
      } else {
        // Swiped right (finger moved left to right) -> Previous slide
        prevSlide();
      }
    }

    // Reset touch coordinates
    touchStartX.current = null;
    touchEndX.current = null;
    touchStartY.current = null;
    touchEndY.current = null;

    // Reset swiping state after short delay to prevent click events on child links
    setTimeout(() => {
      isSwiping.current = false;
    }, 150);
  };

  const handleTouchCancel = () => {
    touchStartX.current = null;
    touchEndX.current = null;
    touchStartY.current = null;
    touchEndY.current = null;
    isSwiping.current = false;
  };

  // Mouse drag fallback (allows desktop users testing mobile viewports to swipe)
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    touchStartX.current = e.clientX;
    touchStartY.current = e.clientY;
    touchEndX.current = e.clientX;
    touchEndY.current = e.clientY;
    isSwiping.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    touchEndX.current = e.clientX;
    touchEndY.current = e.clientY;
    const diffX = touchStartX.current - touchEndX.current;
    if (Math.abs(diffX) > 10) {
      isSwiping.current = true;
    }
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    handleTouchEnd();
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <section 
      className="relative min-h-[75vh] sm:min-h-[82vh] lg:min-h-[88vh] overflow-hidden bg-gray-950 flex items-center touch-pan-y select-none sm:select-auto cursor-grab active:cursor-grabbing sm:cursor-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Background Slides */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.25 } }}
          className="absolute inset-0 transform-gpu will-change-transform"
        >
          {slide.isSpecial ? (
            /* Animated Solar Wobbler Background - Bright & Sunlit morning window ambiance */
            <div className="relative w-full h-full overflow-hidden bg-[#241a0e]">
              {/* Ken-Burns slow zoom on current wobbler photo with high brightness & vibrant colors */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={`bg-img-${activeWobbler.id}`}
                  src={activeWobbler.image}
                  alt={activeWobbler.name}
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{
                    opacity: 0.9,
                    scale: [1, 1.06, 1],
                    x: [0, -8, 0],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    opacity: { duration: 0.6 },
                    scale: { duration: 16, repeat: Infinity, ease: 'easeInOut' },
                  }}
                  className="w-full h-full object-cover object-top filter saturate-125 brightness-110 blur-[1px]"
                />
              </AnimatePresence>

              {/* Luminous Natural Sunburst streaming across the background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-600/20 via-yellow-300/25 to-amber-100/30 pointer-events-none mix-blend-screen" />

              {/* Brilliant Golden Solar Flare */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.45, 0.7, 0.45],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -top-32 right-10 w-[550px] h-[550px] sm:w-[800px] sm:h-[800px] rounded-full bg-gradient-to-br from-yellow-200/50 via-amber-400/40 to-transparent blur-3xl pointer-events-none"
              />

              <motion.div
                animate={{
                  scale: [1.1, 0.95, 1.1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
                className="absolute -bottom-20 right-1/4 w-96 h-96 rounded-full bg-gradient-to-tr from-amber-400/35 to-yellow-200/20 blur-3xl pointer-events-none"
              />

              {/* Orbital Kinetic Rings in radiant gold */}
              <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                  className="w-[500px] h-[500px] rounded-full border border-dashed border-amber-300/35"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-10 rounded-full border border-yellow-300/25"
                />
              </div>

              {/* Floating Golden Dust Particles / Sunlight Motes */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`spark-${i}`}
                  className="absolute w-2.5 h-2.5 rounded-full bg-yellow-200 pointer-events-none blur-[0.5px] shadow-sm shadow-yellow-300"
                  style={{
                    left: `${18 + i * 14}%`,
                    top: `${20 + (i % 3) * 25}%`,
                  }}
                  animate={{
                    y: [-16, 16, -16],
                    x: [-12, 12, -12],
                    opacity: [0.3, 0.95, 0.3],
                    scale: [0.8, 1.5, 0.8],
                  }}
                  transition={{
                    duration: 3.2 + i * 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.35,
                  }}
                />
              ))}

              {/* Soft directional gradient ONLY on the left for text readability - right and center remain bright and sunlit */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 via-40% to-transparent pointer-events-none" />
            </div>
          ) : (
            /* Standard Slide Background */
            <div className="relative w-full h-full">
              <img
                src={slide.image}
                alt={slide.title}
                decoding="async"
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 w-full py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left text column */}
            <div className="lg:col-span-7 max-w-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`content-${currentSlide}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Badge */}
                  {slide.badge && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-4 backdrop-blur-md shadow-sm"
                    >
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${slide.badgeColor}`}>
                        <FiSun className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
                        {slide.badge}
                      </span>
                    </motion.div>
                  )}

                  {/* Title & Highlight */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-3 leading-tight tracking-tight drop-shadow-md">
                    {slide.title}{' '}
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${slide.highlightGradient || 'from-purple-400 to-pink-400'}`}>
                      {slide.highlight}
                    </span>
                  </h1>

                  {/* Subtitle */}
                  <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-5 max-w-xl leading-relaxed drop-shadow-sm">
                    {slide.subtitle}
                  </p>

                  {/* Interactive Variant Tabs for Solar Wobbler */}
                  {slide.isSpecial && (
                    <div className="mb-6">
                      <p className="text-xs text-amber-300 font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <FiSun className="w-3.5 h-3.5 text-amber-400" />
                        Available Models (Real Photos · Natural Light):
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        {WOBBLER_VARIANTS.map((v, idx) => {
                          const isActive = activeWobblerIndex === idx;
                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => {
                                if (!isSwiping.current) setActiveWobblerIndex(idx);
                              }}
                              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                                isActive
                                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-gray-950 shadow-lg shadow-amber-500/40 scale-105 ring-2 ring-amber-300'
                                  : 'bg-black/50 text-amber-100 border border-amber-300/40 hover:bg-black/70 hover:text-white'
                              }`}
                            >
                              <span>{v.badge}</span>
                              {isActive && <span className="w-2 h-2 rounded-full bg-gray-950 animate-ping" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Feature Bullets for Solar Wobbler */}
                  {slide.features && (
                    <div className="grid grid-cols-2 gap-2.5 mb-7 max-w-lg">
                      {slide.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-amber-100 font-medium">
                          <span className="w-4 h-4 rounded-full bg-amber-500/30 text-amber-300 flex items-center justify-center flex-shrink-0">
                            <FiCheck className="w-3 h-3" />
                          </span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                    <Link
                      to={slide.ctaLink}
                      onClick={(e) => {
                        if (isSwiping.current) e.preventDefault();
                      }}
                      className={`inline-flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-full transition-all duration-300 hover:scale-105 min-h-[50px] shadow-lg ${
                        slide.isSpecial
                          ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-gray-950 font-black shadow-amber-500/40 hover:shadow-amber-500/70'
                          : 'bg-white text-gray-950 hover:bg-gray-100 shadow-white/10'
                      }`}
                    >
                      <span>{slide.cta}</span>
                      <FiArrowRight className="w-5 h-5" />
                    </Link>

                    {slide.secondaryCta && (
                      <Link
                        to={slide.secondaryCtaLink}
                        onClick={(e) => {
                          if (isSwiping.current) e.preventDefault();
                        }}
                        className={`inline-flex items-center justify-center gap-2 px-7 py-4 font-bold rounded-full transition-all duration-300 min-h-[50px] ${
                          slide.isSpecial
                            ? 'border-2 border-amber-300 text-white bg-black/30 hover:bg-amber-400/20 hover:border-amber-200'
                            : 'border-2 border-white/80 text-white hover:bg-white hover:text-gray-950'
                        }`}
                      >
                        {slide.isSpecial && <FiZap className="w-4 h-4 text-amber-400" />}
                        <span>{slide.secondaryCta}</span>
                      </Link>
                    )}
                  </div>

                  {/* Trust Badges */}
                  <div className="mt-7 flex flex-wrap gap-3 text-xs sm:text-sm text-white/85 font-medium">
                    <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10">
                      <span>🚚</span> Cash on Delivery
                    </span>
                    <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10">
                      <span>💳</span> bKash / Nagad
                    </span>
                    <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10">
                      <span>🇧🇩</span> Fast Delivery in BD
                    </span>
                  </div>

                  {/* Mobile Swipe Hint */}
                  <div className="sm:hidden mt-5 flex items-center justify-center gap-2 text-white/45 text-[11px] font-medium tracking-wide select-none pointer-events-none">
                    <span className="animate-pulse">←</span>
                    <span>Swipe left or right to change slides</span>
                    <span className="animate-pulse">→</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right column: Authentic Dual Showcase for Desktop - Light & Sunlit */}
            {slide.isSpecial && (
              <div className="lg:col-span-5 hidden lg:flex items-center justify-center relative">
                {/* Circular Radiant Backdrop Solar Glow */}
                <div className="absolute -inset-10 bg-gradient-to-br from-yellow-300/35 via-amber-400/25 to-transparent rounded-full blur-3xl pointer-events-none" />

                {/* Container for Main + Secondary Card */}
                <div className="relative flex items-center justify-center w-full">
                  {/* Secondary Card (Background Preview of other model) */}
                  <div
                    onClick={() => {
                      if (!isSwiping.current) setActiveWobblerIndex(otherWobblerIndex);
                    }}
                    className="absolute -right-2 top-4 w-52 h-[350px] rounded-2xl overflow-hidden border-2 border-amber-300/50 opacity-85 hover:opacity-100 transition-all duration-300 cursor-pointer shadow-2xl transform rotate-6 hover:rotate-2 hover:scale-105 z-0 bg-stone-900/50 backdrop-blur-md"
                    title={`Click to view ${otherWobbler.name}`}
                  >
                    <img
                      src={otherWobbler.image}
                      alt={otherWobbler.name}
                      decoding="async"
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 inset-x-2 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[10px] font-extrabold uppercase shadow-sm">
                        Switch Model
                      </span>
                      <p className="text-xs font-bold text-white mt-1">{otherWobbler.name}</p>
                    </div>
                  </div>

                  {/* Primary Active Card with Authentic Wobbler Subject & Kinetic Sway */}
                  <Link
                    to="/solar-wobbler"
                    onClick={(e) => {
                      if (isSwiping.current) e.preventDefault();
                    }}
                    className="group relative z-10 block cursor-pointer"
                  >
                    <motion.div
                      key={`card-${activeWobbler.id}`}
                      initial={{ scale: 0.95, opacity: 0.8 }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                        rotate: [-2.5, 2.5, -2.5],
                        y: [-5, 5, -5],
                      }}
                      transition={{
                        scale: { duration: 0.4 },
                        opacity: { duration: 0.4 },
                        rotate: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                        y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
                      }}
                      className="relative w-64 h-[400px] xl:w-72 xl:h-[440px] rounded-3xl p-2 bg-white/25 border-2 border-yellow-400 backdrop-blur-md shadow-2xl shadow-yellow-500/40 overflow-hidden"
                    >
                      {/* Inner Image Container preserving 100% of the authentic subject */}
                      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-stone-900">
                        <img
                          src={activeWobbler.image}
                          alt={activeWobbler.name}
                          decoding="async"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                        />

                        {/* Minimal bottom vignette so text/badges pop without dimming the photo */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

                        {/* Top Live Sunlight Badge */}
                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-amber-300/60 rounded-full px-3 py-1 flex items-center gap-1.5 text-xs text-yellow-300 font-bold shadow-md">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Natural Sunlight Active</span>
                        </div>

                        {/* Bottom Label & Call to action */}
                        <div className="absolute bottom-3 inset-x-3 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black text-[11px] font-black uppercase tracking-wider mb-1 shadow-sm">
                            {activeWobbler.name}
                          </span>
                          <p className="text-xs text-white/95 font-semibold">100% Real Photo · Window Sill</p>
                          <p className="text-[11px] text-amber-300 font-bold mt-0.5">Click to Explore Details →</p>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Hidden on mobile, visible on sm and up */}
      <button
        onClick={prevSlide}
        className="hidden sm:flex absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/40 hover:bg-black/70 text-white backdrop-blur-md rounded-full border border-white/10 hover:border-white/30 transition-all hover:scale-110 active:scale-95 cursor-pointer items-center justify-center"
        aria-label="Previous slide"
      >
        <FiChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="hidden sm:flex absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/40 hover:bg-black/70 text-white backdrop-blur-md rounded-full border border-white/10 hover:border-white/30 transition-all hover:scale-110 active:scale-95 cursor-pointer items-center justify-center"
        aria-label="Next slide"
      >
        <FiChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((s, index) => (
          <button
            key={s.id || index}
            onClick={() => goToSlide(index)}
            className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentSlide
                ? s.isSpecial
                  ? 'w-10 bg-gradient-to-r from-amber-400 to-orange-500 shadow-md shadow-amber-500/50'
                  : 'w-10 bg-white shadow-md'
                : 'w-2.5 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
