import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSun, FiZap, FiArrowRight, FiCheck } from 'react-icons/fi';
import solarMonkeyImg from './images/SOLAR_WOBBLER_MONKEY.webp';
import solarBearImg from './images/SOLAR_WOBBLER_BEAR.webp';

export default function SolarWobblerChapter({ darkMode = true }) {
  const highlights = [
    '100% Light Powered · Zero Batteries',
    'Continuous Silent Pendulum Sway',
    'Works Under Desk Lamp or Window Sunlight',
    'Calming Kinetic Desk Presence',
  ];

  return (
    <section
      className={`py-16 sm:py-24 transition-colors duration-500 overflow-hidden ${darkMode ? 'bg-[#0f0e13] text-[#F0EDE8]' : 'bg-[#FFFBF5] text-[#0B0B10]'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* Left Column: Story Copy */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 bg-amber-500/15 text-amber-400 border border-amber-500/25">
                <FiSun className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
                <span>Chapter 03 · Living Art</span>
              </span>

              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mb-4 tracking-tight leading-tight ${darkMode ? 'text-white' : 'text-gray-950'
                  }`}
              >
                Meet Solar Wobbler.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500">
                  Powered by Light.
                </span>
              </h2>

              <p
                className={`text-base sm:text-lg mb-6 leading-relaxed ${darkMode ? 'text-white/75' : 'text-gray-600'
                  }`}
              >
                Zero charging. Zero batteries. Placed on your desk, bookshelf, or window sill, this kinetic companion converts photons into mesmerizing perpetual motion. Pure desk zen.
              </p>

              {/* Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                      <FiCheck className="w-3 h-3" />
                    </span>
                    <span className={darkMode ? 'text-amber-100/90' : 'text-gray-700'}>{h}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/solar-wobbler"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm sm:text-base bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-gray-950 shadow-lg shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Explore Solar Wobbler</span>
                  <FiArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/solar-wobbler#products"
                  className={`inline-flex items-center gap-2 px-6 py-4 rounded-full font-semibold text-sm sm:text-base border backdrop-blur-md transition-all cursor-pointer ${darkMode
                      ? 'text-amber-200 bg-amber-500/10 border-amber-400/30 hover:bg-amber-500/20'
                      : 'text-gray-900 bg-white border-amber-300 hover:bg-amber-50 shadow-sm'
                    }`}
                >
                  <FiZap className="w-4 h-4 text-amber-500" />
                  <span>Order Direct</span>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Dual Model Kinetic Cards */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative flex items-center justify-center gap-4 sm:gap-6"
            >
              {/* Ambient Glow */}
              <div className="absolute -inset-6 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

              {/* Card 1: Monkey Edition */}
              <div className="relative w-40 sm:w-52 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-amber-400/30 bg-black/40 backdrop-blur-md shadow-2xl p-2 flex flex-col">
                <motion.div
                  animate={{ rotate: [-2, 2, -2], y: [-2, 2, -2] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-full flex-1 rounded-xl overflow-hidden bg-stone-900"
                >
                  <img
                    src={solarMonkeyImg}
                    alt="Monkey Edition"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div className="pt-2 text-center">
                  <p className="text-xs font-bold text-white">Monkey Edition</p>
                  <span className="text-[10px] text-amber-400 font-semibold">Peace Sign · Banana</span>
                </div>
              </div>

              {/* Card 2: Bear Edition */}
              <div className="relative w-40 sm:w-52 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-amber-400/30 bg-black/40 backdrop-blur-md shadow-2xl p-2 flex flex-col -mt-6 sm:-mt-8">
                <motion.div
                  animate={{ rotate: [2, -2, 2], y: [2, -2, 2] }}
                  transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                  className="w-full flex-1 rounded-xl overflow-hidden bg-stone-900"
                >
                  <img
                    src={solarBearImg}
                    alt="Sunny Bear Edition"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div className="pt-2 text-center">
                  <p className="text-xs font-bold text-white">Sunny Bear</p>
                  <span className="text-[10px] text-amber-400 font-semibold">Spectacles · Sunflower</span>
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
