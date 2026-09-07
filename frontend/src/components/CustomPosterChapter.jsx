import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUploadCloud, FiSliders, FiPackage, FiArrowRight, FiCheck } from 'react-icons/fi';
import geminiImg from './images/gemini.webp';

export default function CustomPosterChapter({ darkMode = true }) {
  const steps = [
    {
      num: '01',
      icon: FiUploadCloud,
      title: 'Upload Any Image',
      desc: 'Fan art, personal photos, anime screenshots, or digital paintings.',
    },
    {
      num: '02',
      icon: FiSliders,
      title: 'Pick Frame & Finish',
      desc: 'Select A3 or A4, solid wood framing (Black / Natural / Wood), and matte finish.',
    },
    {
      num: '03',
      icon: FiPackage,
      title: 'Delivered in 48-72h',
      desc: 'Rigid bubble-cushioned packaging delivered across all 64 districts in Bangladesh.',
    },
  ];

  return (
    <section
      className={`py-16 sm:py-24 transition-colors duration-500 overflow-hidden ${
        darkMode ? 'bg-[#0B0B10] text-[#F0EDE8]' : 'bg-[#F9FAFB] text-[#0B0B10]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Visual Mockup */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              {/* Subtle ambient glow */}
              <div
                className={`absolute -inset-4 rounded-3xl blur-3xl pointer-events-none ${
                  darkMode ? 'bg-purple-600/20' : 'bg-purple-400/20'
                }`}
              />

              {/* Physical Frame Mockup Container */}
              <div
                className={`relative p-3 sm:p-5 rounded-2xl transition-colors duration-500 ${
                  darkMode
                    ? 'bg-[#15151b] border-2 border-white/10 shadow-2xl'
                    : 'bg-white border-2 border-black/10 shadow-xl'
                }`}
              >
                {/* Image window */}
                <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-black/40">
                  <img
                    src={geminiImg}
                    alt="Custom Poster Printing Preview"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                </div>

                {/* Floating Meta Bar */}
                <div
                  className={`mt-4 p-3 rounded-xl flex items-center justify-between text-xs transition-colors duration-300 ${
                    darkMode ? 'bg-white/5 border border-white/10' : 'bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-semibold">300 GSM Archival Pigment Matte</span>
                  </div>
                  <span className="font-bold text-purple-500">Custom Made in BD</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Editorial & Steps */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Chapter 02 · Made For You
              </span>

              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold font-heading mb-4 tracking-tight leading-tight ${
                  darkMode ? 'text-white' : 'text-gray-950'
                }`}
              >
                Your Vision.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  Framed to Perfection.
                </span>
              </h2>

              <p
                className={`text-base sm:text-lg mb-8 leading-relaxed ${
                  darkMode ? 'text-white/70' : 'text-gray-600'
                }`}
              >
                Can't find your exact aesthetic? Upload any image, fan art, or memory. We print with archival inks on heavy 300 GSM matte stock and build a museum-grade frame to match.
              </p>

              {/* 3 Step Cards */}
              <div className="space-y-4 mb-8">
                {steps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.num}
                      className={`p-3.5 sm:p-4 rounded-xl border flex items-start gap-4 transition-colors duration-300 ${
                        darkMode
                          ? 'bg-white/5 border-white/10 hover:border-purple-500/40'
                          : 'bg-white border-gray-200 hover:border-purple-400 shadow-sm'
                      }`}
                    >
                      <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 mt-0.5">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className={`text-sm sm:text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {step.title}
                        </h3>
                        <p className={`text-xs sm:text-sm mt-0.5 ${darkMode ? 'text-white/60' : 'text-gray-600'}`}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA */}
              <Link
                to="/customize"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm sm:text-base bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Create Custom Poster</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
