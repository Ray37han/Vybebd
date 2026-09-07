import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiSun,
  FiZap,
  FiPause,
  FiPlay,
  FiShield,
  FiTruck,
  FiCheck,
} from 'react-icons/fi';

// Curated authentic wall art & product assets
import roomAnimeImg from './images/room-anime.png';
import movies2Img from './images/MOVIES 2.webp';
import roomGamingImg from './images/room-gaming.png';
import solarWobblerMonkeyImg from './images/SOLAR_WOBBLER_MONKEY.webp';
import solarWobblerBearImg from './images/SOLAR_WOBBLER_BEAR.webp';

const WOBBLER_MODELS = [
  {
    id: 'monkey',
    name: 'Monkey Edition',
    badge: '🐒 Monkey',
    image: solarWobblerMonkeyImg,
  },
  {
    id: 'bear',
    name: 'Sunny Bear',
    badge: '🐻 Sunny Bear',
    image: solarWobblerBearImg,
  },
];

const slides = [
  {
    id: 'anime',
    category: 'Anime & Pop Culture',
    eyebrow: 'ARCHIVAL ART PRINTS · PREMIUM MATTE',
    title: 'Your Walls.',
    highlight: 'Curated Elegance.',
    highlightGradient: 'from-violet-500 via-fuchsia-400 to-pink-500',
    subtitle: 'Gallery-quality anime and aesthetic prints. Premium non-glare protection, deep blacks, and vibrant pigment inks.',
    cta: 'Shop Anime Art',
    ctaLink: '/products?category=anime',
    secondaryCta: 'Custom Posters',
    secondaryCtaLink: '/customize',
    image: roomAnimeImg,
    frameTitle: 'Otaku Collection',
    frameSub: 'Archival Pigment Matte Finish',
    frameTag: 'Art Print',
  },
  {
    id: 'cinema',
    category: 'Cinema & Cult Classics',
    eyebrow: 'MUSEUM GALLERY EDITIONS',
    title: 'Cinema Legends,',
    highlight: 'Curated For Life.',
    highlightGradient: 'from-amber-400 via-orange-400 to-yellow-500',
    subtitle: 'The Godfather, Star Wars, Scarface, and iconic moments captured in ultra-high resolution. Timeless art for modern spaces.',
    cta: 'Shop Cinema Art',
    ctaLink: '/products?category=movies',
    secondaryCta: 'All Collections',
    secondaryCtaLink: '/products',
    image: movies2Img,
    frameTitle: 'Classic Cinema',
    frameSub: 'Ultra-High Dynamic Range',
    frameTag: 'Art Print',
  },
  {
    id: 'motorsport',
    category: 'Motorsport & Battlestation',
    eyebrow: 'CIRCUITS & SPEED HERITAGE',
    title: 'Raw Adrenaline.',
    highlight: 'On Your Wall.',
    highlightGradient: 'from-cyan-400 via-blue-500 to-indigo-500',
    subtitle: 'From Monaco corners to midnight asphalt. Precision automotive and sports art engineered to elevate your battlestation.',
    cta: 'Shop Motorsport',
    ctaLink: '/products?category=f1',
    secondaryCta: 'Gaming Posters',
    secondaryCtaLink: '/products?category=games',
    image: roomGamingImg,
    frameTitle: 'Speed & Sports',
    frameSub: 'Anti-Glare Satin Finish',
    frameTag: 'Art Print',
  },
  {
    id: 'solar-wobbler',
    isSpecial: true,
    category: 'Kinetic Living Art',
    eyebrow: '100% LIGHT-POWERED · ZERO BATTERIES',
    title: 'Meet Solar Wobbler.',
    highlight: 'Perpetual Motion.',
    highlightGradient: 'from-amber-400 via-yellow-400 to-orange-400',
    subtitle: 'Hypnotic kinetic desk art rocking continuously in natural window sunlight or lamp illumination. Zero charging, zero cords, pure calm.',
    cta: 'Discover Wobbler',
    ctaLink: '/solar-wobbler',
    secondaryCta: 'Order Direct (৳)',
    secondaryCtaLink: '/solar-wobbler#products',
    image: solarWobblerMonkeyImg,
    frameTitle: 'Solar Wobbler',
    frameSub: 'Natural Window Sunlight Active',
    frameTag: 'Living Art',
  },
];

export default function HeroCarousel({ darkMode: propDarkMode }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeWobblerIndex, setActiveWobblerIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Synchronized theme detection (supports prop + .dark html class)
  const [isDark, setIsDark] = useState(() => {
    if (typeof propDarkMode === 'boolean') return propDarkMode;
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  useEffect(() => {
    if (typeof propDarkMode === 'boolean') {
      setIsDark(propDarkMode);
      return;
    }
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [propDarkMode]);

  // Smooth auto-advance
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [currentSlide, isPaused]);

  // Wobbler auto-cycle
  useEffect(() => {
    if (slides[currentSlide]?.isSpecial) {
      const wobblerTimer = setInterval(() => {
        setActiveWobblerIndex((prev) => (prev + 1) % WOBBLER_MODELS.length);
      }, 4500);
      return () => clearInterval(wobblerTimer);
    }
  }, [currentSlide]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];
  const activeWobbler = WOBBLER_MODELS[activeWobblerIndex];

  // Touch swipe support optimized for mobile
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const touchStartY = useRef(null);
  const touchEndY = useRef(null);
  const isSwiping = useRef(false);

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
    if (Math.abs(diffX) > 10) isSwiping.current = true;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diffX = touchStartX.current - touchEndX.current;
    const diffY = touchStartY.current - touchEndY.current;
    const minSwipeDistance = 30;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
    touchStartY.current = null;
    touchEndY.current = null;
    setTimeout(() => {
      isSwiping.current = false;
    }, 150);
  };

  return (
    <section
      className={`relative min-h-[520px] sm:min-h-[600px] lg:min-h-[680px] overflow-hidden transition-colors duration-500 flex items-center select-none ${
        isDark ? 'bg-[#0B0B10] text-[#F0EDE8]' : 'bg-[#F9FAFB] text-[#0B0B10]'
      }`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Poster & Kinetic Art Showcase"
    >
      {/* ───────────────────────────────────────────────────────────────────
          Zero-Flicker Background Stack
          ─────────────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {slides.map((s, idx) => {
          const isActive = idx === currentSlide;
          const bgImg = s.isSpecial ? activeWobbler.image : s.image;
          return (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={bgImg}
                alt=""
                aria-hidden="true"
                className={`w-full h-full object-cover object-center filter blur-2xl scale-105 ${
                  isDark ? 'opacity-20' : 'opacity-10'
                }`}
              />
            </div>
          );
        })}

        {/* Ambient Gradient Overlays for Guaranteed Text Legibility */}
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            isDark
              ? 'bg-gradient-to-r from-[#0B0B10] via-[#0B0B10]/95 to-[#0B0B10]/40'
              : 'bg-gradient-to-r from-[#F9FAFB] via-[#F9FAFB]/95 to-[#F9FAFB]/30'
          }`}
        />
        <div
          className={`absolute inset-0 ${
            isDark
              ? 'bg-gradient-to-t from-[#0B0B10] via-transparent to-[#0B0B10]/50'
              : 'bg-gradient-to-t from-[#F9FAFB] via-transparent to-[#F9FAFB]/40'
          }`}
        />
      </div>

      {/* ───────────────────────────────────────────────────────────────────
          Main Content & Visual Stage (Clean, Frameless Layout)
          ─────────────────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full py-8 sm:py-14 lg:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Editorial Copy */}
            <div className="lg:col-span-7 max-w-2xl text-left">
              {/* Eyebrow Badge */}
              <div
                className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase mb-3 sm:mb-4 backdrop-blur-md border transition-colors duration-300 ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white/90'
                    : 'bg-black/5 border-black/10 text-gray-800'
                }`}
              >
                {slide.isSpecial ? (
                  <FiSun className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '12s' }} />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
                <span>{slide.eyebrow}</span>
              </div>

              {/* Title & Highlight */}
              <h1
                className={`text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading mb-2.5 sm:mb-4 leading-[1.12] tracking-tight transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-950'
                }`}
              >
                {slide.title}{' '}
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${slide.highlightGradient}`}>
                  {slide.highlight}
                </span>
              </h1>

              {/* Subtitle */}
              <p
                className={`text-xs sm:text-base lg:text-lg mb-5 sm:mb-7 max-w-xl leading-relaxed line-clamp-2 sm:line-clamp-none transition-colors duration-300 ${
                  isDark ? 'text-white/70' : 'text-gray-600'
                }`}
              >
                {slide.subtitle}
              </p>

              {/* Wobbler Model Switcher (Only on Wobbler slide) */}
              {slide.isSpecial && (
                <div
                  className={`mb-5 p-1 rounded-2xl border backdrop-blur-md inline-flex items-center gap-1 transition-colors duration-300 ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                  }`}
                >
                  {WOBBLER_MODELS.map((model, idx) => {
                    const isSelected = activeWobblerIndex === idx;
                    return (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => {
                          if (!isSwiping.current) setActiveWobblerIndex(idx);
                        }}
                        className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-gray-950 shadow-md font-bold'
                            : isDark
                            ? 'text-white/70 hover:text-white'
                            : 'text-gray-700 hover:text-gray-950'
                        }`}
                      >
                        <span>{model.badge}</span>
                        {isSelected && <FiCheck className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 sm:gap-4">
                <Link
                  to={slide.ctaLink}
                  onClick={(e) => {
                    if (isSwiping.current) e.preventDefault();
                  }}
                  className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-full font-semibold text-xs sm:text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md cursor-pointer ${
                    slide.isSpecial
                      ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-gray-950 font-bold shadow-amber-500/30 hover:shadow-amber-500/50'
                      : isDark
                      ? 'bg-white text-gray-950 hover:bg-gray-100 shadow-white/10'
                      : 'bg-gray-950 text-white hover:bg-gray-800 shadow-gray-400/40'
                  }`}
                >
                  <span>{slide.cta}</span>
                  <FiArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                </Link>

                {slide.secondaryCta && (
                  <Link
                    to={slide.secondaryCtaLink}
                    onClick={(e) => {
                      if (isSwiping.current) e.preventDefault();
                    }}
                    className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full font-medium text-xs sm:text-base border backdrop-blur-md transition-all duration-200 cursor-pointer ${
                      isDark
                        ? 'text-white/90 bg-white/5 hover:bg-white/10 border-white/15 hover:border-white/30'
                        : 'text-gray-800 bg-white/80 hover:bg-white border-gray-300 hover:border-gray-400 shadow-sm'
                    }`}
                  >
                    {slide.isSpecial && <FiZap className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-amber-500" />}
                    <span>{slide.secondaryCta}</span>
                  </Link>
                )}
              </div>

              {/* Minimal Trust Strip (Delivery within 2 to 5 days, no wood specs, no ratings) */}
              <div
                className={`mt-6 sm:mt-10 pt-4 sm:pt-6 border-t flex flex-wrap items-center gap-3.5 sm:gap-6 text-[11px] sm:text-xs font-medium transition-colors duration-300 ${
                  isDark ? 'border-white/10 text-white/60' : 'border-gray-200 text-gray-600'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <FiTruck className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${isDark ? 'text-white/80' : 'text-gray-800'}`} />
                  <span>Delivery within 2 to 5 days</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FiShield className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${isDark ? 'text-white/80' : 'text-gray-800'}`} />
                  <span>Cash on Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>🇧🇩</span>
                  <span>All 64 Districts</span>
                </div>
              </div>
            </div>

            {/* Right Column: Sleek Modern Showcase Card (No wooden frame, no mat board) */}
            <div className="lg:col-span-5 flex items-center justify-center mt-4 sm:mt-6 lg:mt-0">
              <div className="relative w-full max-w-[210px] sm:max-w-[280px] lg:max-w-sm xl:max-w-md aspect-[4/5]">
                
                {/* ─────────────────────────────────────────────────────────────
                    STAGE A: POSTER SLIDES — MODERN BORDERLESS CARD
                    Solid wooden frame & passe-partout mat board DELETED
                    ───────────────────────────────────────────────────────────── */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    !slide.isSpecial ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
                  }`}
                >
                  {/* Ambient Soft Glow Behind Card */}
                  <div
                    className={`absolute -inset-3 rounded-3xl blur-2xl transition-opacity duration-700 pointer-events-none ${
                      isDark ? 'bg-purple-600/20 opacity-60' : 'bg-gray-400/20 opacity-30'
                    }`}
                  />

                  {/* Physical Picture Frame with Gallery Moulding */}
                  <div
                    className={`relative w-full h-full p-2 sm:p-3.5 rounded-sm sm:rounded-md transition-all duration-500 ${
                      isDark
                        ? 'bg-[#18181b] border-[8px] sm:border-[12px] border-[#121214] ring-1 ring-white/15 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.85)]'
                        : 'bg-[#FDFBF7] border-[8px] sm:border-[12px] border-[#1c1917] ring-1 ring-black/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.25)]'
                    }`}
                  >
                    {/* Passe-Partout / Museum Mat Board */}
                    <div
                      className={`relative w-full h-full p-1.5 sm:p-2.5 rounded-[2px] transition-colors duration-500 overflow-hidden ${
                        isDark ? 'bg-[#1f1f23] shadow-inner' : 'bg-[#FAF8F5] shadow-inner'
                      }`}
                    >
                      {/* Inner Framed Poster Window */}
                      <div className="relative w-full h-full overflow-hidden border border-black/20 shadow-md">
                        {slides.filter((s) => !s.isSpecial).map((s) => {
                          const isCurrent = s.id === slide.id;
                          return (
                            <div
                              key={s.id}
                              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                                isCurrent ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
                              }`}
                            >
                              <img
                                src={s.image}
                                alt={s.frameTitle}
                                decoding="async"
                                className="w-full h-full object-cover object-center"
                              />
                            </div>
                          );
                        })}

                        {/* Acrylic Glass Specular Glare */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/12 to-transparent pointer-events-none z-20" />

                        {/* Plaque Gradient Vignette */}
                        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none z-20" />

                        {/* Museum Plaque */}
                        <div className="absolute bottom-2 inset-x-2 z-30 flex items-center justify-between p-1.5 sm:p-2 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 text-left text-white shadow-md">
                          <div className="min-w-0 pr-1.5">
                            <p className="text-[9px] sm:text-[11px] font-bold tracking-wide truncate">
                              {slide.frameTitle}
                            </p>
                            <p className="text-[8px] sm:text-[9px] text-white/70 truncate">
                              {slide.frameSub}
                            </p>
                          </div>
                          <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold uppercase tracking-wider bg-white/15 text-white border border-white/20">
                            Framed Art
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ─────────────────────────────────────────────────────────────
                    STAGE B: SOLAR WOBBLER — FRAMELESS KINETIC ART SHOWCASE
                    ───────────────────────────────────────────────────────────── */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    slide.isSpecial ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
                  }`}
                >
                  {/* Ambient Golden Sunburst Glow */}
                  <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-amber-500/30 via-yellow-400/20 to-transparent blur-2xl pointer-events-none" />

                  {/* Frameless Kinetic Card */}
                  <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-amber-400/40 bg-gradient-to-b from-amber-500/10 via-black/40 to-black/80 backdrop-blur-xl shadow-2xl shadow-amber-500/20 p-2 sm:p-3 flex flex-col justify-between">
                    
                    {/* Living Kinetic Motion Visual (Gentle Pendulum Sway) */}
                    <div className="relative w-full flex-1 rounded-xl sm:rounded-2xl overflow-hidden bg-stone-900/60 flex items-center justify-center">
                      <motion.div
                        animate={{
                          rotate: [-2, 2, -2],
                          y: [-2, 2, -2],
                        }}
                        transition={{
                          duration: 3.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="w-full h-full"
                      >
                        <img
                          src={activeWobbler.image}
                          alt={activeWobbler.name}
                          decoding="async"
                          className="w-full h-full object-cover object-center"
                        />
                      </motion.div>

                      {/* Natural Sunlight Pill Badge */}
                      <div className="absolute top-2.5 left-2.5 bg-black/65 backdrop-blur-md border border-amber-300/40 rounded-full px-2.5 py-0.5 flex items-center gap-1.5 text-[9px] sm:text-[10px] text-yellow-300 font-bold shadow-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Real Sunlight Active</span>
                      </div>

                      {/* Frameless Soft Vignette */}
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

                      {/* Model Tag Plaque */}
                      <div className="absolute bottom-2.5 inset-x-2.5 z-20 flex items-center justify-between p-2 rounded-xl bg-black/75 backdrop-blur-md border border-amber-400/30 text-left text-white shadow-md">
                        <div>
                          <p className="text-[10px] sm:text-xs font-bold text-amber-300">
                            {activeWobbler.name}
                          </p>
                          <p className="text-[8px] sm:text-[9px] text-white/70">
                            Zero Batteries · Endless Sway
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 text-gray-950 shadow-sm">
                          Kinetic Art
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Desktop Chevron Navigation */}
      <button
        onClick={prevSlide}
        className={`hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-11 lg:h-11 rounded-full border backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer items-center justify-center ${
          isDark
            ? 'bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border-white/10'
            : 'bg-white/80 hover:bg-white text-gray-800 border-gray-300 shadow-md'
        }`}
        aria-label="Previous slide"
      >
        <FiChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className={`hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-11 lg:h-11 rounded-full border backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer items-center justify-center ${
          isDark
            ? 'bg-white/5 hover:bg-white/15 text-white/80 hover:text-white border-white/10'
            : 'bg-white/80 hover:bg-white text-gray-800 border-gray-300 shadow-md'
        }`}
        aria-label="Next slide"
      >
        <FiChevronRight className="w-5 h-5" />
      </button>

      {/* Modern Control Bar: Dots + Pause/Play */}
      <div
        className={`absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-full border backdrop-blur-xl shadow-lg transition-colors duration-300 ${
          isDark ? 'bg-black/50 border-white/10 text-white' : 'bg-white/80 border-black/10 text-gray-900 shadow-md'
        }`}
      >
        <button
          onClick={() => setIsPaused((v) => !v)}
          className={`p-1 sm:p-1.5 rounded-full transition-colors cursor-pointer ${
            isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-950 hover:bg-black/5'
          }`}
          aria-label={isPaused ? 'Resume autoplay' : 'Pause autoplay'}
          title={isPaused ? 'Resume' : 'Pause'}
        >
          {isPaused ? <FiPlay className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <FiPause className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
        </button>

        <div className={`h-2.5 sm:h-3 w-px mx-0.5 ${isDark ? 'bg-white/15' : 'bg-black/15'}`} />

        {slides.map((s, index) => {
          const isActive = index === currentSlide;
          return (
            <button
              key={s.id}
              onClick={() => goToSlide(index)}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? isDark
                    ? 'w-5 sm:w-7 bg-white shadow-sm'
                    : 'w-5 sm:w-7 bg-gray-950 shadow-sm'
                  : isDark
                  ? 'w-1.5 sm:w-2 bg-white/30 hover:bg-white/50'
                  : 'w-1.5 sm:w-2 bg-black/20 hover:bg-black/40'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          );
        })}
      </div>
    </section>
  );
}
