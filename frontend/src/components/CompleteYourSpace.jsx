/**
 * CompleteYourSpace.jsx
 *
 * Context-aware cross-sell component.
 * - On POSTER/HOME-DECOR pages → compact Solar Wobbler teaser
 * - On WOBBLER pages            → 3 poster category tiles
 *
 * All React hooks are called at the top level of their component — never inside
 * callbacks, conditionals, or Array.map(). Each tile is its own component.
 */

import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  FiArrowRight, FiSun, FiZap, FiHeart,
  FiTrendingUp, FiFeather, FiGrid,
} from 'react-icons/fi';

// ─── Animation helper (respects prefers-reduced-motion) ───────────────────────
function useReveal(delay = 0) {
  const shouldReduce = useReducedMotion();
  return {
    initial: shouldReduce ? {} : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: shouldReduce ? {} : { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
  };
}

// ─── 1. WOBBLER TEASER (shown on poster / home-decor pages) ──────────────────
function WobblerTeaser({ dm }) {
  const reveal = useReveal();
  const shouldReduce = useReducedMotion();

  return (
    <motion.section
      {...reveal}
      aria-label="Complete Your Space — Solar Wobbler cross-sell"
      className={`mt-8 rounded-2xl overflow-hidden border transition-colors duration-300 ${
        dm
          ? 'bg-gradient-to-r from-yellow-900/20 to-orange-900/15 border-yellow-400/20'
          : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
      }`}
    >
      <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
        {/* Animated icon */}
        <div className={`flex-none w-20 h-20 rounded-2xl flex items-center justify-center ${
          dm ? 'bg-yellow-500/10' : 'bg-yellow-100'
        }`}>
          <motion.div
            animate={shouldReduce ? {} : { rotate: [0, 10, -10, 8, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
          >
            <FiSun className="w-10 h-10 text-yellow-500" />
          </motion.div>
        </div>

        {/* Text */}
        <div className="flex-1 text-center sm:text-left">
          <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${
            dm ? 'text-yellow-400' : 'text-orange-500'
          }`}>
            Complete Your Space
          </p>
          <h3 className={`text-lg sm:text-xl font-black mb-1 ${
            dm ? 'text-white' : 'text-gray-900'
          }`}>
            Add Kinetic Life to Your Desk
          </h3>
          <p className={`text-sm leading-relaxed ${dm ? 'text-gray-400' : 'text-gray-600'}`}>
            The Solar Wobbler pairs perfectly with any VYBE poster —
            solar-powered, silent, zero batteries, endless motion.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
            {[
              { Icon: FiZap, text: 'Solar Powered' },
              { Icon: FiSun, text: 'No Batteries' },
              { Icon: FiHeart, text: 'Silent Motor' },
            ].map(({ Icon, text }) => (
              <span
                key={text}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                  dm ? 'bg-white/8 text-gray-300' : 'bg-white text-gray-600 border border-amber-200'
                }`}
              >
                <Icon className="w-3 h-3 text-yellow-500" />
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex-none">
          <Link
            to="/solar-wobbler"
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition-all duration-300 hover:scale-[1.03] shadow-md hover:shadow-lg min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2 ${
              dm
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
            }`}
          >
            See Wobbler
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.section>
  );
}

// ─── 2. POSTER TILE — own component so hooks run at top level (not in .map) ──
function PosterTile({ cat, delay, dm }) {
  const tileReveal = useReveal(delay);
  const shouldReduce = useReducedMotion();
  const { Icon } = cat;

  return (
    <motion.div
      {...tileReveal}
      whileHover={shouldReduce ? {} : { y: -4, scale: 1.01 }}
      className={`group rounded-2xl p-5 transition-all duration-300 cursor-pointer ${
        dm
          ? 'bg-white/5 border border-white/10 hover:border-white/20'
          : `${cat.lightBg} border ${cat.lightBorder} hover:shadow-md`
      }`}
    >
      <Link to={`/products?category=${cat.slug}`} className="block">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h4 className={`font-bold text-base mb-1 ${dm ? 'text-white' : 'text-gray-900'}`}>
          {cat.label}
        </h4>
        <p className={`text-xs ${dm ? 'text-gray-400' : 'text-gray-500'}`}>
          {cat.description}
        </p>
        <div className={`mt-3 inline-flex items-center gap-1 text-xs font-bold transition-colors ${
          dm ? 'text-gray-400 group-hover:text-white' : `${cat.lightText} group-hover:opacity-70`
        }`}>
          Browse <FiArrowRight className="w-3 h-3" />
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Category definitions ─────────────────────────────────────────────────────
const POSTER_CATEGORIES = [
  {
    slug: 'motivational',
    label: 'Motivational',
    description: 'Fuel your focus',
    Icon: FiTrendingUp,
    gradient: 'from-purple-600 to-pink-500',
    lightBg: 'bg-purple-50',
    lightBorder: 'border-purple-100',
    lightText: 'text-purple-600',
  },
  {
    slug: 'abstract',
    label: 'Abstract Art',
    description: 'Bold & expressive',
    Icon: FiFeather,
    gradient: 'from-blue-500 to-indigo-600',
    lightBg: 'bg-blue-50',
    lightBorder: 'border-blue-100',
    lightText: 'text-blue-600',
  },
  {
    slug: 'anime',
    label: 'Anime',
    description: 'Iconic characters',
    Icon: FiGrid,
    gradient: 'from-rose-500 to-orange-500',
    lightBg: 'bg-rose-50',
    lightBorder: 'border-rose-100',
    lightText: 'text-rose-600',
  },
];

// ─── 3. POSTER TILES SECTION (shown on wobbler pages) ─────────────────────────
function PosterTiles({ dm }) {
  const reveal = useReveal();

  return (
    <motion.section
      {...reveal}
      aria-label="Complete Your Space — poster recommendations"
      className="mt-10 sm:mt-14"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${
            dm ? 'text-yellow-400' : 'text-orange-500'
          }`}>Complete Your Space</p>
          <h3 className={`text-xl sm:text-2xl font-black ${dm ? 'text-white' : 'text-gray-900'}`}>
            Add a Poster.{' '}
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              Finish the Vibe.
            </span>
          </h3>
        </div>
        <Link
          to="/products"
          className={`hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 ${
            dm ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          All Posters <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {POSTER_CATEGORIES.map((cat, i) => (
          <PosterTile key={cat.slug} cat={cat} delay={i * 0.08} dm={dm} />
        ))}
      </div>

      <div className="mt-4 text-center sm:hidden">
        <Link
          to="/products"
          className={`inline-flex items-center gap-1.5 text-sm font-semibold ${
            dm ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          Browse All Posters <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.section>
  );
}

// ─── ROOT EXPORT ──────────────────────────────────────────────────────────────
export default function CompleteYourSpace({ productType = 'poster', darkMode = false }) {
  const isWobbler = productType === 'wobbler';
  return isWobbler
    ? <PosterTiles dm={darkMode} />
    : <WobblerTeaser dm={darkMode} />;
}
