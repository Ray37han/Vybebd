import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPercent, FiPackage, FiArrowRight, FiZap } from 'react-icons/fi';

// Curated authentic poster assets for the bundle stack
import animeImg from './images/ANIME.webp';
import footballImg from './images/FOOTBALL.webp';
import gamesImg from './images/GAMES.webp';

export default function BundleSection({ darkMode: propDarkMode }) {
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

  const perks = [
    {
      count: '2+ Posters',
      discount: '30% OFF',
      desc: 'Starter Duo Bundle',
    },
    {
      count: '6+ Posters',
      discount: '35% OFF',
      desc: 'Room Gallery Set',
      popular: true,
    },
    {
      count: '10+ Posters',
      discount: '40% OFF',
      desc: 'Collector Studio Pack',
    },
  ];

  return (
    <section
      className={`py-14 sm:py-20 relative overflow-hidden transition-colors duration-500 ${
        isDark ? 'bg-[#0B0B10] text-[#F0EDE8]' : 'bg-[#F9FAFB] text-[#0B0B10]'
      }`}
    >
      {/* Ambient background glows */}
      <div
        className={`absolute top-1/2 -left-20 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-opacity duration-500 ${
          isDark ? 'bg-purple-600/20' : 'bg-purple-400/20'
        }`}
      />
      <div
        className={`absolute top-1/2 -right-20 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-opacity duration-500 ${
          isDark ? 'bg-pink-600/15' : 'bg-pink-400/15'
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={`rounded-3xl border backdrop-blur-xl p-6 sm:p-10 lg:p-14 transition-all duration-500 ${
            isDark
              ? 'border-white/10 bg-gradient-to-br from-violet-950/40 via-[#151026] to-[#0e091d] shadow-2xl shadow-black/60'
              : 'border-purple-200/80 bg-gradient-to-br from-purple-50/90 via-white to-pink-50/80 shadow-xl shadow-purple-500/5'
          }`}
        >
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Content Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7"
            >
              <div
                className={`inline-flex items-center gap-2 border px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-5 transition-colors duration-300 ${
                  isDark
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30 text-purple-300'
                    : 'bg-purple-100/80 border-purple-300 text-purple-700'
                }`}
              >
                <FiPercent className="w-3.5 h-3.5 text-pink-500" />
                <span>Limited Time Offer</span>
              </div>

              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading mb-4 leading-[1.15] tracking-tight transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-950'
                }`}
              >
                Bundle & Save{' '}
                <span
                  className={`text-transparent bg-clip-text bg-gradient-to-r ${
                    isDark
                      ? 'from-purple-400 via-pink-400 to-amber-300'
                      : 'from-purple-600 via-pink-600 to-amber-500'
                  }`}
                >
                  Up to 40% OFF
                </span>
              </h2>

              <p
                className={`text-base sm:text-lg mb-8 max-w-xl leading-relaxed transition-colors duration-300 ${
                  isDark ? 'text-white/75' : 'text-gray-600'
                }`}
              >
                Create your perfect gallery wall. Buy 2 or more posters and unlock exclusive discounts. Mix and match across any anime, sports, gaming, and cinema series.
              </p>

              {/* CTA Button */}
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white font-bold rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-purple-500/30 cursor-pointer min-h-[48px]"
                >
                  <FiPackage className="w-4 h-4" />
                  <span>Shop Bundles</span>
                  <FiArrowRight className="w-4 h-4" />
                </Link>
                <span
                  className={`text-xs flex items-center gap-1.5 transition-colors duration-300 ${
                    isDark ? 'text-white/50' : 'text-gray-500'
                  }`}
                >
                  <FiZap className="w-3.5 h-3.5 text-amber-500" />
                  Discount automatically applies in cart
                </span>
              </div>

              {/* Exact Bundle Perks Cards */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
                {perks.map((p, idx) => (
                  <div
                    key={idx}
                    className={`relative p-3 sm:p-4 rounded-2xl border transition-all text-center ${
                      p.popular
                        ? isDark
                          ? 'bg-purple-600/15 border-purple-400/40 shadow-lg shadow-purple-600/20 ring-1 ring-purple-400/30'
                          : 'bg-purple-50/90 border-purple-400 shadow-md ring-1 ring-purple-300'
                        : isDark
                        ? 'bg-white/5 border-white/10 hover:border-white/20'
                        : 'bg-white border-gray-200 hover:border-purple-300 shadow-sm'
                    }`}
                  >
                    {p.popular && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full text-white shadow-sm whitespace-nowrap">
                        Popular
                      </span>
                    )}
                    <p
                      className={`text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${
                        isDark ? 'from-purple-300 to-pink-300' : 'from-purple-600 to-pink-600'
                      }`}
                    >
                      {p.count.replace(' Posters', '')}
                    </p>
                    <p
                      className={`text-xs sm:text-sm font-bold mt-0.5 transition-colors duration-300 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {p.discount}
                    </p>
                    <p
                      className={`text-[10px] sm:text-xs mt-1 truncate transition-colors duration-300 ${
                        isDark ? 'text-white/60' : 'text-gray-500'
                      }`}
                    >
                      {p.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Visual Column: Dynamic 3D Fanned Poster Stack */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 flex items-center justify-center"
            >
              <div className="relative w-full max-w-[320px] sm:max-w-[360px] h-[340px] sm:h-[380px] flex items-center justify-center group">
                
                {/* Ambient Soft Glow Behind Stack */}
                <div
                  className={`absolute inset-4 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
                    isDark
                      ? 'bg-gradient-to-tr from-purple-600/30 to-pink-500/25'
                      : 'bg-gradient-to-tr from-purple-300/30 to-pink-200/25'
                  }`}
                />

                {/* Poster 1 (Left Fan): Football */}
                <div
                  className={`absolute left-2 sm:left-4 top-6 sm:top-8 w-36 sm:w-44 aspect-[3/4] rounded-2xl overflow-hidden border shadow-2xl transform -rotate-12 group-hover:-rotate-16 group-hover:-translate-x-3 transition-transform duration-500 ${
                    isDark ? 'border-white/20 bg-stone-950' : 'border-black/10 bg-white'
                  }`}
                >
                  <img
                    src={footballImg}
                    alt="Football Art"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/10 pointer-events-none" />
                </div>

                {/* Poster 2 (Right Fan): Gaming */}
                <div
                  className={`absolute right-2 sm:right-4 top-6 sm:top-8 w-36 sm:w-44 aspect-[3/4] rounded-2xl overflow-hidden border shadow-2xl transform rotate-12 group-hover:rotate-16 group-hover:translate-x-3 transition-transform duration-500 ${
                    isDark ? 'border-white/20 bg-stone-950' : 'border-black/10 bg-white'
                  }`}
                >
                  <img
                    src={gamesImg}
                    alt="Gaming Art"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/10 pointer-events-none" />
                </div>

                {/* Poster 3 (Center Hero): Anime */}
                <div
                  className={`relative z-20 w-40 sm:w-48 aspect-[3/4] rounded-2xl overflow-hidden border-2 shadow-2xl transform -rotate-2 group-hover:scale-105 group-hover:rotate-0 transition-all duration-500 ${
                    isDark
                      ? 'border-white/30 bg-stone-950 shadow-black/90'
                      : 'border-white/80 bg-white shadow-purple-900/15'
                  }`}
                >
                  <img
                    src={animeImg}
                    alt="Anime Art"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none" />
                  
                  {/* Subtle Inner Bottom Vignette */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                  <p className="absolute bottom-2.5 inset-x-2 text-center text-[10px] font-bold text-white/90">
                    Gallery Wall Set
                  </p>
                </div>

                {/* Floating Discount Pill Badge */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -right-2 sm:-right-4 bottom-8 z-30 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 text-gray-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/30 border border-emerald-200/50 flex items-center gap-1.5"
                >
                  <FiZap className="w-3.5 h-3.5" />
                  <span>SAVE 40%</span>
                </motion.div>

              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
