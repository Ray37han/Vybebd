import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { FiTruck, FiPhone, FiShield } from 'react-icons/fi';

/**
 * Footer — VYBE 2.0
 * 4 columns: Shop / Support / VYBE / Payment & Delivery
 * No newsletter form (single newsletter section is on homepage before footer).
 */

export default function Footer() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const applyTheme = () => {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(saved ? saved === 'dark' : prefersDark);
    };
    applyTheme();
    window.addEventListener('storage', applyTheme);
    window.addEventListener('themeChange', applyTheme);
    return () => {
      window.removeEventListener('storage', applyTheme);
      window.removeEventListener('themeChange', applyTheme);
    };
  }, []);

  const dk = darkMode;
  const bg   = dk ? '#0B0B10' : '#F4F4F5';
  const text  = dk ? '#B0ACBE' : '#6B7280';
  const head  = dk ? '#F0EDE8' : '#0B0B10';
  const divBorder = dk ? 'border-white/[0.06]' : 'border-black/[0.06]';
  const linkHover = dk ? 'hover:text-white' : 'hover:text-[#0B0B10]';

  return (
    <footer style={{ backgroundColor: bg }} className={`transition-colors duration-300 pt-14 pb-10`}>
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* ── Column 1: Shop ── */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest mb-5" style={{ color: '#8B5CF6' }}>Shop</h4>
            <ul className="space-y-0.5">
              {[
                { label: 'All Posters',     to: '/products' },
                { label: 'Custom Posters',  to: '/customize' },
                { label: 'Home Decor',      to: '/home-decor' },
                { label: 'Solar Wobbler',   to: '/solar-wobbler' },
                { label: 'Bundles',         to: '/products?tag=bundle' },
                { label: 'New Arrivals',    to: '/products?sort=newest' },
              ].map(l => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className={`block py-2 min-h-[44px] text-[14px] transition-colors ${linkHover}`}
                    style={{ color: text }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 2: Support ── */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest mb-5" style={{ color: '#8B5CF6' }}>Support</h4>
            <ul className="space-y-0.5">
              {[
                { label: 'Track My Order',     to: '/my-orders' },
                { label: 'Shipping Info',       to: '/shipping' },
                { label: 'Returns & Exchange',  to: '/returns' },
                { label: 'FAQ',                 to: '/faq' },
                { label: 'Privacy Policy',      to: '/privacy-policy' },
                { label: 'Terms of Service',    to: '/terms-of-service' },
              ].map(l => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className={`block py-2 min-h-[44px] text-[14px] transition-colors ${linkHover}`}
                    style={{ color: text }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: VYBE ── */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest mb-5" style={{ color: '#8B5CF6' }}>VYBE</h4>
            {/* Brand blurb */}
            <p className="text-[13px] leading-relaxed mb-6" style={{ color: text }}>
              Premium wall art for what you&apos;re into. Sports, anime, gaming, custom prints — made in Bangladesh.
            </p>
            {/* Socials */}
            <div className="flex gap-2">
              {[
                { href: 'https://www.facebook.com/profile.php?id=61580594942475', icon: <FaFacebook className="w-4 h-4" />, label: 'Facebook' },
                { href: 'https://www.instagram.com/vybe.bd/', icon: <FaInstagram className="w-4 h-4" />, label: 'Instagram' },
                { href: 'https://wa.me/8801410809138', icon: <FaWhatsapp className="w-4 h-4" />, label: 'WhatsApp' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-full border transition-colors ${
                    dk
                      ? 'border-white/10 text-[#B0ACBE] hover:text-white hover:border-white/30 hover:bg-white/[0.06]'
                      : 'border-black/10 text-[#6B7280] hover:text-[#0B0B10] hover:border-black/20 hover:bg-black/[0.04]'
                  }`}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Column 4: Payment & Delivery ── */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest mb-5" style={{ color: '#8B5CF6' }}>Payment &amp; Delivery</h4>

            {/* Payment methods */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#E2136E] text-white leading-none">bKash</span>
                <span className="text-[13px]" style={{ color: text }}>Accepted</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#F7941D] text-white leading-none">Nagad</span>
                <span className="text-[13px]" style={{ color: text }}>Accepted</span>
              </div>
              <div className="flex items-center gap-2.5">
                <FiShield className="w-4 h-4 flex-shrink-0" style={{ color: '#8B5CF6' }} />
                <span className="text-[13px]" style={{ color: text }}>Cash on Delivery</span>
              </div>
            </div>

            {/* Delivery info */}
            <div className={`p-3.5 rounded-xl border text-[12px] space-y-1.5 ${dk ? 'border-white/[0.06] bg-white/[0.03]' : 'border-black/[0.06] bg-black/[0.02]'}`}>
              <div className="flex items-center gap-2 font-semibold" style={{ color: head }}>
                <FiTruck className="w-3.5 h-3.5" style={{ color: '#8B5CF6' }} />
                Delivery Charges
              </div>
              <p style={{ color: text }}>Inside Dhaka — <strong style={{ color: head }}>৳100</strong></p>
              <p style={{ color: text }}>Outside Dhaka — <strong style={{ color: head }}>৳140</strong></p>
            </div>

            {/* Contact */}
            <a
              href="https://wa.me/8801410809138"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-2 text-[13px] transition-colors hover:text-[#8B5CF6]"
              style={{ color: text }}
            >
              <FiPhone className="w-3.5 h-3.5" />
              WhatsApp Support
            </a>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] ${divBorder}`} style={{ color: text }}>
          <p>© {new Date().getFullYear()} VYBE. All rights reserved. Made with ♥ in Bangladesh.</p>
          <p>
            Made by{' '}
            <a
              href="https://www.linkedin.com/in/rakibul-hasan-rayhan/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#8B5CF6] underline underline-offset-2"
            >
              Rakibul Hasan Rayhan
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
