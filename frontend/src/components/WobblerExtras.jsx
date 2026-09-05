import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  FiSun, FiZap, FiChevronDown, FiStar, FiArrowRight,
  FiHeart, FiMonitor, FiBookOpen, FiHome, FiVolumeX,
  FiCheck, FiTrendingUp, FiFeather, FiMoon, FiRefreshCw,
  FiDroplet, FiWifi, FiPackage, FiLayout,
} from 'react-icons/fi';
import { productsAPI } from '../api';
import CompleteYourSpace from './CompleteYourSpace';

// ─── Animation helpers (respects prefers-reduced-motion) ─────────────────────
function useReveal(delay = 0) {
  const shouldReduce = useReducedMotion();
  return {
    initial: shouldReduce ? {} : { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: shouldReduce ? {} : { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
  };
}

// ─── Custom SVG icons not in react-icons/fi ──────────────────────────────────

/** Leaf / eco icon */
function IconLeaf({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 22 L12 12" />
      <path d="M12 2C12 2 22 6 22 14C22 22 12 22 12 22C12 22 2 18 2 10C2 2 12 2 12 2Z" />
    </svg>
  );
}

/** No-battery icon (battery with X) */
function IconNoBattery({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="7" width="16" height="10" rx="2" />
      <path d="M18 11h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-2" />
      <line x1="6" y1="11" x2="10" y2="15" />
      <line x1="10" y1="11" x2="6" y2="15" />
    </svg>
  );
}

/** Window icon */
function IconWindow({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="12" y1="3" x2="12" y2="21" />
    </svg>
  );
}

/** Wobble / rotation icon (3 circular arrows) */
function IconWobble({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2a10 10 0 1 0 10 10" />
      <polyline points="22 2 22 12 12 12" />
      <path d="M8 12a4 4 0 1 0 4-4" strokeDasharray="2 2" />
    </svg>
  );
}

/** Animated SVG sun (replaces ☀️ in the story visual column) */
function SunSVG({ dm }) {
  const shouldReduce = useReducedMotion();
  return (
    <motion.svg
      viewBox="0 0 120 120"
      className="w-40 h-40 sm:w-48 sm:h-48 relative z-10 drop-shadow-2xl"
      animate={shouldReduce ? {} : { rotate: 360 }}
      transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
    >
      {/* Core circle */}
      <circle cx="60" cy="60" r="24" fill={dm ? '#F59E0B' : '#FBBF24'} />
      {/* Inner glow */}
      <circle cx="60" cy="60" r="18" fill={dm ? '#FCD34D' : '#FDE68A'} opacity="0.7" />
      {/* Rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 60 60)`}>
          <rect x="57" y="8" width="6" height="14" rx="3" fill={dm ? '#F59E0B' : '#F59E0B'} />
        </g>
      ))}
    </motion.svg>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ eyebrow, title, subtitle, dm }) {
  const reveal = useReveal();
  return (
    <motion.div {...reveal} className="text-center mb-12 sm:mb-16">
      {eyebrow && (
        <span className={`inline-block text-xs font-bold uppercase tracking-[0.2em] mb-3 ${dm ? 'text-yellow-400' : 'text-orange-500'}`}>
          {eyebrow}
        </span>
      )}
      <h2 className={`text-3xl sm:text-4xl font-black mb-3 ${dm ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`max-w-xl mx-auto text-base sm:text-lg ${dm ? 'text-gray-400' : 'text-gray-500'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

// ─── 1. HOW IT WORKS ──────────────────────────────────────────────────────────
const STEPS = [
  {
    n: '01',
    Icon: FiSun,
    iconColor: 'text-yellow-500',
    iconBg: 'bg-yellow-500/10',
    title: 'Place Near Light',
    body: 'Set it on your desk by the window, under a desk lamp, or anywhere light reaches. Direct sunlight is best, but indoor ambient light is enough.',
  },
  {
    n: '02',
    Icon: FiZap,
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-500/10',
    title: 'Solar Cell Activates',
    body: 'The photovoltaic panel on top converts incoming light into a tiny electric current. This powers a silent DC micro-motor sealed inside the base.',
  },
  {
    n: '03',
    Icon: IconWobble,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-500/10',
    title: 'It Starts Wobbling',
    body: 'The motor drives a gentle rocking motion — a continuous, meditative sway that never stops as long as light is present. Zero noise. Zero batteries.',
  },
];

function HowItWorksSection({ dm }) {
  return (
    <section className={`py-16 sm:py-24 ${dm ? 'bg-gradient-to-b from-transparent to-yellow-900/10' : 'bg-yellow-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The Science"
          title="How the Wobbler Works"
          subtitle="Three steps from unboxing to endless kinetic motion."
          dm={dm}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-10">
          {STEPS.map((step, i) => {
            const reveal = useReveal(i * 0.12);
            const { Icon } = step;
            return (
              <motion.div
                key={step.n}
                {...reveal}
                whileHover={useReducedMotion() ? {} : { y: -6 }}
                className={`relative p-8 rounded-2xl text-center transition-all duration-300 ${
                  dm
                    ? 'bg-white/5 border border-white/10 hover:border-yellow-400/30'
                    : 'bg-white shadow-md hover:shadow-xl border border-yellow-100'
                }`}
              >
                {/* Step number badge */}
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white ${dm ? 'bg-yellow-500' : 'bg-orange-500'}`}>
                  {step.n}
                </div>
                {/* SVG icon */}
                <div className={`w-16 h-16 rounded-2xl ${step.iconBg} flex items-center justify-center mx-auto mb-5 mt-3`}>
                  <Icon className={`w-8 h-8 ${step.iconColor}`} />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${dm ? 'text-white' : 'text-gray-900'}`}>{step.title}</h3>
                <p className={`text-sm leading-relaxed ${dm ? 'text-gray-400' : 'text-gray-600'}`}>{step.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── 2. PRODUCT STORY ────────────────────────────────────────────────────────
const BRAND_VALUES = [
  {
    Icon: IconNoBattery,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    label: 'Zero Batteries',
    sub: 'Forever maintenance-free',
  },
  {
    Icon: IconLeaf,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    label: 'Eco-Friendly',
    sub: 'No waste, no toxins',
  },
  {
    Icon: FiVolumeX,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    label: 'Silent Motor',
    sub: 'Whisper-quiet operation',
  },
  {
    Icon: FiSun,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    label: 'Works Anywhere',
    sub: 'Sun or indoor light',
  },
];

function ProductStorySection({ product, dm }) {
  const reveal = useReveal();
  const revealR = useReveal(0.1);
  return (
    <section className="py-16 sm:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text column */}
          <motion.div {...reveal}>
            <span className={`inline-block text-xs font-bold uppercase tracking-[0.2em] mb-4 ${dm ? 'text-yellow-400' : 'text-orange-500'}`}>
              The Story
            </span>
            <h2 className={`text-3xl sm:text-4xl font-black mb-6 leading-tight ${dm ? 'text-white' : 'text-gray-900'}`}>
              A Desk That's{' '}
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Alive.
              </span>
            </h2>
            <div className={`space-y-4 text-base leading-relaxed ${dm ? 'text-gray-400' : 'text-gray-600'}`}>
              <p>
                We started VYBE as a poster brand. But a poster stays still. It decorates. It doesn't <em>move</em>.
              </p>
              <p>
                The Solar Wobbler changes that. It's the first VYBE product that responds to its environment —
                dancing faster in sunlight, slowing to a gentle meditation in soft indoor light.
              </p>
              <p>
                No plug. No batteries. No sound. Just perpetual, effortless kinetic art that reminds you the world
                is in constant, beautiful motion — even when you're deep in work.
              </p>
            </div>
            {/* Inline brand values */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {BRAND_VALUES.map(({ Icon, color, bg, label, sub }) => (
                <div key={label} className={`flex items-start gap-3 p-3 rounded-xl ${dm ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center flex-none`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${dm ? 'text-white' : 'text-gray-900'}`}>{label}</p>
                    <p className={`text-xs ${dm ? 'text-gray-500' : 'text-gray-500'}`}>{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Visual column — animated SVG sun */}
          <motion.div {...revealR} className="flex items-center justify-center">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
              {/* Outer pulsing ring */}
              <motion.div
                className={`absolute inset-0 rounded-full border-2 ${dm ? 'border-yellow-400/20' : 'border-yellow-300/60'}`}
                animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.15, 0.4] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Mid ring */}
              <motion.div
                className={`absolute inset-8 rounded-full border ${dm ? 'border-orange-400/20' : 'border-orange-300/40'}`}
                animate={{ scale: [1, 1.04, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              />
              {/* Glow */}
              <div className={`absolute inset-12 rounded-full blur-2xl ${dm ? 'bg-yellow-500/15' : 'bg-yellow-400/20'}`} />
              {/* Animated SVG sun */}
              <SunSVG dm={dm} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── 3. LIFESTYLE PLACEMENT ──────────────────────────────────────────────────
const PLACEMENTS = [
  {
    Icon: FiMonitor,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    label: 'Work Desk',
    tip: 'Next to your monitor — let it wobble while you focus.',
  },
  {
    Icon: IconWindow,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    label: 'Windowsill',
    tip: 'Direct sunlight = maximum wobble energy. Perfect for your window ledge.',
  },
  {
    Icon: FiBookOpen,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    label: 'Study Shelf',
    tip: 'A quiet, inspiring presence while you read or study.',
  },
  {
    Icon: FiMoon,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    label: 'Bedroom Dresser',
    tip: 'Soft room light keeps it gently swaying. A calm bedtime companion.',
  },
];

function LifestyleSection({ dm }) {
  return (
    <section className={`py-16 sm:py-24 ${dm ? 'bg-white/3' : 'bg-orange-50/60'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Where to Place It"
          title="Fits Anywhere Light Reaches"
          subtitle="Four ideal spots for your Solar Wobbler to do its thing."
          dm={dm}
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {PLACEMENTS.map((p, i) => {
            const reveal = useReveal(i * 0.1);
            const { Icon } = p;
            return (
              <motion.div
                key={p.label}
                {...reveal}
                whileHover={useReducedMotion() ? {} : { y: -6, scale: 1.02 }}
                className={`group p-6 rounded-2xl text-center cursor-default transition-all duration-300 ${
                  dm
                    ? 'bg-white/5 border border-white/10 hover:border-yellow-400/40 hover:bg-white/8'
                    : 'bg-white shadow-sm hover:shadow-lg border border-orange-100 hover:border-orange-200'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl ${p.bg} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-7 h-7 ${p.color}`} />
                </div>
                <h3 className={`font-bold text-base mb-2 ${dm ? 'text-white' : 'text-gray-900'}`}>{p.label}</h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${dm ? 'text-gray-400' : 'text-gray-600'}`}>{p.tip}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── 4. SPECIFICATIONS ───────────────────────────────────────────────────────
const SPECS = [
  { label: 'Power Source', value: 'Photovoltaic solar cell (no batteries required)', Icon: FiSun },
  { label: 'Light Required', value: 'Sunlight or indoor ambient light (≥100 lux)', Icon: FiWifi },
  { label: 'Motor Type', value: 'Silent DC micro-motor (electromagnetic drive)', Icon: FiRefreshCw },
  { label: 'Motion Type', value: 'Continuous rotary wobble / rocking motion', Icon: IconWobble },
  { label: 'Material', value: 'ABS plastic body with weighted base', Icon: FiPackage },
  { label: 'Sound Level', value: 'Essentially silent (micro-motor hum imperceptible)', Icon: FiVolumeX },
  { label: 'Batteries', value: 'None — ever', Icon: IconNoBattery },
  { label: 'Operating Condition', value: 'Indoor / outdoor, dry environments only', Icon: FiDroplet },
  { label: 'Care', value: 'Wipe clean with dry cloth. Do not submerge.', Icon: FiLayout },
];

function SpecificationsSection({ product, dm }) {
  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Product Details"
          title="Specifications"
          dm={dm}
        />
        <motion.div
          {...useReveal()}
          className={`rounded-2xl overflow-hidden border ${dm ? 'border-white/10' : 'border-gray-200'}`}
        >
          {SPECS.map((spec, i) => {
            const { Icon } = spec;
            return (
              <div
                key={spec.label}
                className={`grid grid-cols-[1fr_1.6fr] gap-4 px-6 py-4 transition-colors ${
                  i % 2 === 0
                    ? dm ? 'bg-white/5' : 'bg-gray-50'
                    : dm ? 'bg-white/3' : 'bg-white'
                } ${dm ? 'border-b border-white/5' : 'border-b border-gray-100'} last:border-0`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 flex-none ${dm ? 'text-gray-500' : 'text-gray-400'}`} />
                  <span className={`text-sm font-semibold ${dm ? 'text-gray-400' : 'text-gray-500'}`}>{spec.label}</span>
                </div>
                <span className={`text-sm ${dm ? 'text-white' : 'text-gray-900'}`}>{spec.value}</span>
              </div>
            );
          })}
          {/* Product-specific dimensions from DB if available */}
          {product?.sizes?.length > 0 && product.sizes[0]?.dimensions && (
            <div className={`grid grid-cols-[1fr_1.6fr] gap-4 px-6 py-4 ${dm ? 'bg-white/5 border-b border-white/5' : 'bg-gray-50 border-b border-gray-100'}`}>
              <div className="flex items-center gap-2.5">
                <FiPackage className={`w-4 h-4 flex-none ${dm ? 'text-gray-500' : 'text-gray-400'}`} />
                <span className={`text-sm font-semibold ${dm ? 'text-gray-400' : 'text-gray-500'}`}>Dimensions</span>
              </div>
              <span className={`text-sm ${dm ? 'text-white' : 'text-gray-900'}`}>{product.sizes[0].dimensions}</span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ─── 5. FAQ ──────────────────────────────────────────────────────────────────
const WOBBLER_FAQ = [
  {
    q: 'Does it need batteries?',
    a: 'No — never. The Solar Wobbler is powered entirely by light. A photovoltaic panel converts light energy into electricity that drives the micro-motor. In complete darkness, it stops; as soon as light returns, it starts again automatically.',
  },
  {
    q: 'Will it work in my room without direct sunlight?',
    a: 'Yes. Ambient indoor lighting (from ceiling lights, desk lamps, or diffused window light) is usually sufficient to keep it wobbling. More light = faster wobble. Direct sunlight gives the most energetic motion.',
  },
  {
    q: 'Is it noisy?',
    a: 'The micro-motor is whisper-quiet. Most users cannot hear it at all. It is appropriate for offices, study rooms, and bedrooms.',
  },
  {
    q: 'Will it tip over?',
    a: 'The base is weighted to prevent tipping during normal wobble motion. Place it on a flat, stable surface and it will rock safely without falling.',
  },
  {
    q: 'How do I clean it?',
    a: 'Wipe with a soft dry cloth. Do not use water, sprays, or solvents. Keep away from rain or high humidity.',
  },
  {
    q: 'What is the return policy?',
    a: 'If your wobbler arrives damaged or does not work as described, contact VYBE within 7 days of delivery for a replacement. We stand behind every product we sell.',
  },
];

function FAQItem({ item, dm }) {
  const [open, setOpen] = useState(false);
  const shouldReduce = useReducedMotion();

  return (
    <div className={`border-b last:border-0 ${dm ? 'border-white/10' : 'border-gray-200'}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`w-full flex items-center justify-between py-5 text-left gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 rounded ${dm ? 'text-white' : 'text-gray-900'}`}
      >
        <span className="font-semibold text-base leading-snug">{item.q}</span>
        <motion.span
          animate={shouldReduce ? {} : { rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-none"
        >
          <FiChevronDown className={`w-5 h-5 ${dm ? 'text-gray-400' : 'text-gray-500'}`} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={shouldReduce ? {} : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={shouldReduce ? {} : { height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className={`pb-5 leading-relaxed text-sm sm:text-base ${dm ? 'text-gray-400' : 'text-gray-600'}`}>
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQSection({ dm }) {
  return (
    <section className={`py-16 sm:py-24 ${dm ? 'bg-white/3' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Got Questions?"
          title="Frequently Asked"
          subtitle="Everything you need to know before you order."
          dm={dm}
        />
        <motion.div
          {...useReveal()}
          className={`rounded-2xl px-6 sm:px-8 ${dm ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200 shadow-sm'}`}
        >
          {WOBBLER_FAQ.map((item) => (
            <FAQItem key={item.q} item={item} dm={dm} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── 6. REVIEWS ──────────────────────────────────────────────────────────────
function StarRow({ rating, size = 'sm' }) {
  const sz = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          className={`${sz} ${star <= Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

function ReviewsSection({ product, dm }) {
  const reviews = product?.reviews || [];
  const rating = product?.rating || { average: 0, count: 0 };

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Customer Reviews"
          title={`${rating.count > 0 ? `${rating.average.toFixed(1)} / 5` : 'Reviews'}`}
          subtitle={rating.count > 0 ? `Based on ${rating.count} verified purchase${rating.count !== 1 ? 's' : ''}` : undefined}
          dm={dm}
        />

        {/* Aggregate rating display */}
        {rating.count > 0 && (
          <motion.div {...useReveal()} className="flex items-center justify-center gap-4 mb-12">
            <div className="text-6xl font-black text-yellow-500">{rating.average.toFixed(1)}</div>
            <div>
              <StarRow rating={rating.average} size="lg" />
              <p className={`text-sm mt-1 ${dm ? 'text-gray-400' : 'text-gray-500'}`}>{rating.count} reviews</p>
            </div>
          </motion.div>
        )}

        {/* Review cards */}
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {reviews.slice(0, 6).map((review, i) => {
              const reveal = useReveal(i * 0.08);
              return (
                <motion.div
                  key={review._id || i}
                  {...reveal}
                  className={`p-6 rounded-2xl ${dm ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-100 shadow-sm'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <StarRow rating={review.rating} />
                    <span className={`text-xs ${dm ? 'text-gray-500' : 'text-gray-400'}`}>
                      {new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  {review.comment && (
                    <p className={`text-sm leading-relaxed ${dm ? 'text-gray-300' : 'text-gray-700'}`}>
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  )}
                  <p className={`text-xs font-semibold mt-3 flex items-center gap-1 ${dm ? 'text-gray-500' : 'text-gray-400'}`}>
                    <FiCheck className="w-3 h-3 text-green-500" />
                    Verified Purchase
                  </p>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <motion.div {...useReveal()} className="text-center py-12">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${dm ? 'bg-yellow-500/10' : 'bg-yellow-100'}`}>
              <FiSun className="w-10 h-10 text-yellow-500" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${dm ? 'text-white' : 'text-gray-900'}`}>
              Be the First to Review
            </h3>
            <p className={`mb-6 max-w-sm mx-auto text-sm ${dm ? 'text-gray-400' : 'text-gray-500'}`}>
              Order your Solar Wobbler and tell us what you think. Reviews help other customers and help us improve.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ─── 7. RELATED PRODUCTS ─────────────────────────────────────────────────────
function RelatedCard({ product, dm }) {
  const imgUrl = product.images?.[0]?.urls?.medium || product.images?.[0]?.urls?.thumbnail || product.images?.[0]?.url || '';
  const name = product.name?.replace(/\s*\|\|\s*#\d+/g, '').replace(/\s*#\d+$/, '').trim();
  const hasDiscount = product.originalPrice && product.originalPrice > product.basePrice;

  return (
    <motion.div
      whileHover={useReducedMotion() ? {} : { y: -5 }}
      className={`group rounded-2xl overflow-hidden transition-all duration-300 ${
        dm
          ? 'bg-white/5 border border-white/10 hover:border-yellow-400/30'
          : 'bg-white border border-gray-100 hover:border-yellow-200 hover:shadow-lg'
      }`}
    >
      <Link to={`/products/${product._id}`} className="block relative overflow-hidden aspect-square">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* Placeholder — SVG sun instead of emoji */
          <div className={`w-full h-full flex items-center justify-center ${dm ? 'bg-white/5' : 'bg-yellow-50'}`}>
            <FiSun className="w-12 h-12 text-yellow-400" />
          </div>
        )}
        {product.newArrival && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">NEW</div>
        )}
      </Link>
      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className={`font-semibold text-sm line-clamp-2 mb-2 hover:text-yellow-600 transition-colors ${dm ? 'text-white' : 'text-gray-900'}`}>
            {name}
          </h3>
        </Link>
        {product.rating?.count > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <StarRow rating={product.rating.average} />
            <span className={`text-xs ${dm ? 'text-gray-500' : 'text-gray-400'}`}>({product.rating.count})</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-orange-500">৳{product.basePrice}</span>
          {hasDiscount && (
            <span className={`text-xs line-through ${dm ? 'text-gray-600' : 'text-gray-400'}`}>৳{product.originalPrice}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function RelatedProductsSection({ productId, dm }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current || !productId) return;
    fetched.current = true;

    const fetchRelated = async () => {
      try {
        const res = await productsAPI.getRelated(productId, 6);
        const data = res.data || res;
        setRelated(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    };

    const fetchFallback = async () => {
      try {
        const res = await productsAPI.getAll({ category: 'solar-wobbler', limit: 6 });
        const data = res.data || res;
        const products = data.products || data || [];
        setRelated(products.filter((p) => p._id !== productId).slice(0, 6));
      } catch { /* silent */ }
    };

    fetchRelated().then(() => {
      if (related.length === 0) fetchFallback();
    });
  }, [productId]);

  if (!loading && related.length === 0) return null;

  return (
    <section className={`py-16 sm:py-24 ${dm ? 'bg-white/3' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="You Might Also Like"
          title="More Solar Wobblers"
          dm={dm}
        />
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden animate-pulse ${dm ? 'bg-white/5' : 'bg-gray-100'}`}>
                <div className={`aspect-square ${dm ? 'bg-white/8' : 'bg-gray-200'}`} />
                <div className="p-4 space-y-2">
                  <div className={`h-3 rounded w-3/4 ${dm ? 'bg-white/8' : 'bg-gray-200'}`} />
                  <div className={`h-3 rounded w-1/2 ${dm ? 'bg-white/8' : 'bg-gray-200'}`} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {related.map((p) => (
              <RelatedCard key={p._id} product={p} dm={dm} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── ROOT EXPORT ─────────────────────────────────────────────────────────────
/**
 * WobblerExtras
 * Renders all below-fold sections for Solar Wobbler product pages.
 * Conditionally injected by ProductDetail.jsx when product.productType === 'wobbler'.
 * All icons are SVG (react-icons/fi or inline SVG) — zero emoji.
 *
 * @param {object}  product  - full product object from API
 * @param {boolean} darkMode - current theme state
 */
export default function WobblerExtras({ product, darkMode = false }) {
  const dm = darkMode;

  return (
    <div className={`transition-colors duration-300 ${dm ? 'text-white' : 'text-gray-900'}`}>
      {/* Visual divider */}
      <div className={`h-px mx-auto max-w-7xl ${dm ? 'bg-white/10' : 'bg-gray-200'}`} />

      <HowItWorksSection dm={dm} />
      <ProductStorySection product={product} dm={dm} />
      <LifestyleSection dm={dm} />
      <SpecificationsSection product={product} dm={dm} />
      <FAQSection dm={dm} />
      <ReviewsSection product={product} dm={dm} />
      <RelatedProductsSection productId={product?._id} dm={dm} />

      {/* Smart cross-sell: wobbler context → shows poster category tiles */}
      <div className="py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CompleteYourSpace productType="wobbler" darkMode={dm} />
        </div>
      </div>
    </div>
  );
}
