import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiPackage, FiMoon, FiSun, FiSearch, FiChevronDown, FiEdit } from 'react-icons/fi';
import { useAuthStore, useCartStore } from '../store';
import { authAPI, productsAPI } from '../api';
import toast from 'react-hot-toast';

// ─── Category images (same as CollectionGrid / Shop by Passion) ───────────────
import footballImg    from './images/FOOTBALL.webp';
import carsImg        from './images/CARS.webp';
import bikesImg       from './images/BIKES.webp';
import f1Img          from './images/F1.webp';
import seriesImg      from './images/SERIES.webp';
import moviesImg      from './images/MOVIES.webp';
import musicImg       from './images/MUSIC.webp';
import gamesImg       from './images/GAMES.webp';
import animeImg       from './images/ANIME.webp';
import motivationalImg from './images/MOTIVATIONAL.webp';
import homeDecorImg   from './images/HOME_DECOR.webp';
import solarWobblerImg from './images/SOLAR_WOBBLER.webp';
import geminiImg       from './images/gemini.webp';

// ─── Category data with images ────────────────────────────────────────────────
const CATEGORY_GROUPS = [
  {
    group: 'Sports',
    items: [
      { value: 'football',    label: 'Football',     img: footballImg,     tagline: 'Icons of the beautiful game' },
      { value: 'f1',          label: 'Formula 1',    img: f1Img,           tagline: 'Speed legends & racing icons' },
      { value: 'bikes',       label: 'Bikes',         img: bikesImg,       tagline: 'Ride the wall art' },
    ],
  },
  {
    group: 'Culture',
    items: [
      { value: 'anime',       label: 'Anime',         img: animeImg,       tagline: 'Unleash your inner otaku' },
      { value: 'games',       label: 'Gaming',         img: gamesImg,      tagline: 'Level up your room' },
      { value: 'movies',      label: 'Movies',         img: moviesImg,     tagline: 'Cinema on your wall' },
      { value: 'tv-series',   label: 'TV Series',      img: seriesImg,     tagline: 'Your favourite shows' },
      { value: 'music',       label: 'Music',          img: musicImg,      tagline: 'Feel the beat every day' },
    ],
  },
  {
    group: 'Style',
    items: [
      { value: 'cars',          label: 'Cars',           img: carsImg,         tagline: 'Dream machines on walls' },
      { value: 'motivational',  label: 'Motivational',   img: motivationalImg, tagline: 'Fuel your hustle' },
    ],
  },
];

const FEATURED_COLLECTIONS = [
  {
    label: 'Solar Wobbler',
    link: '/solar-wobbler',
    img: solarWobblerImg,
    badge: '✨ Kinetic Art',
    badgeColor: 'amber',
    desc: 'Light-powered perpetual companion',
  },
  {
    label: 'Home Decor',
    link: '/home-decor',
    img: homeDecorImg,
    badge: '🖼️ Wall Decor',
    badgeColor: 'purple',
    desc: 'Frames, canvas & room styling',
  },
  {
    label: 'Custom Poster',
    link: '/customize',
    img: geminiImg,
    badge: '🎨 Make It Yours',
    badgeColor: 'pink',
    desc: 'Upload design & print custom vibe',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const cleanName = (name = '') =>
  name
    .replace(/\s*\|\|\s*#\d+/g, '')
    .replace(/\s*#\d+$/g, '')
    .replace(/\s*\(\d+\)$/g, '')
    .replace(/\s*-\s*\d+$/g, '')
    .replace(/^\d+\.\s*/g, '')
    .trim();

// ─── Main component ───────────────────────────────────────────────────────────
export default function NavbarOptimized() {
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [shopOpen, setShopOpen]           = useState(false);
  const [userMenuOpen, setUserMenuOpen]   = useState(false);
  const [darkMode, setDarkMode]           = useState(false);
  const [scrolled, setScrolled]           = useState(false);
  const [hoveredItem, setHoveredItem]     = useState(null);  // tracks hovered category item

  // Search
  const [searchQuery, setSearchQuery]         = useState('');
  const [suggestions, setSuggestions]         = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef     = useRef(null);
  const searchTimer   = useRef(null);
  const shopRef       = useRef(null);
  const userMenuRef   = useRef(null);
  const shopTimer     = useRef(null); // delay close to avoid flicker

  const { isAuthenticated, user, logout } = useAuthStore();
  const itemCount = useCartStore(s => s.getItemCount());
  const navigate  = useNavigate();
  const location  = useLocation();

  /* ── Scroll shadow ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Close on route change ── */
  useEffect(() => {
    setMobileOpen(false);
    setShopOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  /* ── Click-outside handlers ── */
  useEffect(() => {
    const handler = e => {
      if (shopRef.current && !shopRef.current.contains(e.target)) setShopOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = e => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = e => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Theme init ── */
  useEffect(() => {
    const applyTheme = isDark => {
      setDarkMode(isDark);
      document.documentElement.classList.toggle('dark', isDark);
    };
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved ? saved === 'dark' : prefersDark);

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystem = e => { if (!localStorage.getItem('theme')) applyTheme(e.matches); };
    const onStorage = () => {
      const t = localStorage.getItem('theme');
      if (t) applyTheme(t === 'dark');
    };
    mq.addEventListener('change', onSystem);
    window.addEventListener('storage', onStorage);
    window.addEventListener('themeChange', onStorage);
    return () => {
      mq.removeEventListener('change', onSystem);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('themeChange', onStorage);
    };
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    localStorage.setItem('theme', next ? 'dark' : 'light');
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    window.dispatchEvent(new Event('themeChange'));
  };

  /* ── Logout ── */
  const handleLogout = async () => {
    try { await authAPI.logout(); logout(); toast.success('Logged out'); navigate('/'); } catch {}
  };

  /* ── Search ── */
  const fetchSuggestions = useCallback(q => {
    clearTimeout(searchTimer.current);
    if (!q || q.trim().length < 2) { setSuggestions([]); setShowSuggestions(false); return; }
    searchTimer.current = setTimeout(async () => {
      try {
        const res = await productsAPI.searchSuggestions(q.trim());
        setSuggestions(res.data || []);
        setShowSuggestions(true);
      } catch { setShowSuggestions(false); }
    }, 250);
  }, []);

  const submitSearch = q => {
    const term = (q || searchQuery).trim();
    if (!term) return;
    setShowSuggestions(false); setSearchQuery(''); setMobileOpen(false);
    navigate(`/products?search=${encodeURIComponent(term)}`);
  };

  /* ── Shop hover with slight delay to avoid flicker ── */
  const openShop = () => {
    clearTimeout(shopTimer.current);
    setShopOpen(true);
  };
  const closeShop = () => {
    shopTimer.current = setTimeout(() => setShopOpen(false), 120);
  };

  const dk = darkMode;

  // Nav bar background — starts transparent, frosted glass on scroll
  const navBg = scrolled
    ? dk
      ? 'bg-[#0B0B10]/90 backdrop-blur-2xl border-white/[0.07] shadow-[0_1px_0_rgba(255,255,255,0.07)]'
      : 'bg-white/90 backdrop-blur-2xl border-black/[0.08] shadow-[0_1px_0_rgba(0,0,0,0.07)]'
    : dk
      ? 'bg-[#0B0B10]/50 backdrop-blur-md border-transparent'
      : 'bg-white/60 backdrop-blur-md border-transparent';

  // Preview item: defaults to first category in first group
  const allItems = CATEGORY_GROUPS.flatMap(g => g.items);
  const previewItem = hoveredItem || allItems[0];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${navBg}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[52px] md:h-[60px]">

          {/* ── Logo ── */}
          <Link to="/" className="flex-shrink-0 select-none" aria-label="VYBE home">
            <span
              className="font-heading font-black text-[1.65rem] tracking-tight leading-none"
              style={{ letterSpacing: '-0.02em' }}
            >
              <span className={dk ? 'text-white' : 'text-[#0B0B10]'}>VY</span>
              <span className="text-[#8B5CF6]">BE</span>
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          <nav className="hidden md:flex items-center" aria-label="Primary">
            {/* Shop with mega-dropdown */}
            <div
              ref={shopRef}
              className="relative"
              onMouseEnter={openShop}
              onMouseLeave={closeShop}
            >
              <button
                onClick={() => navigate('/products')}
                aria-expanded={shopOpen}
                aria-haspopup="true"
                className={`apple-nav-link ${dk ? 'apple-nav-link--dark' : 'apple-nav-link--light'}`}
              >
                Shop
                <FiChevronDown
                  className="w-3 h-3 ml-0.5 opacity-60 transition-transform duration-200"
                  style={{ transform: shopOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>

              {/* ── Mega dropdown ── */}
              <div
                className={`
                  absolute top-full left-1/2 -translate-x-1/2 mt-[13px]
                  w-[720px] rounded-2xl overflow-hidden
                  border transition-all duration-[220ms] ease-out origin-top
                  shadow-[0_24px_64px_rgba(0,0,0,0.32)]
                  ${shopOpen
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-[0.97] -translate-y-2 pointer-events-none'
                  }
                  ${dk
                    ? 'bg-[#111117] border-white/[0.1]'
                    : 'bg-[#FAFAFA] border-black/[0.08]'
                  }
                `}
                role="menu"
                aria-label="Shop categories"
                onMouseEnter={openShop}
                onMouseLeave={closeShop}
              >
                {/* ── Upper: Categories Grid + Live Category Preview ── */}
                <div className="flex">
                  {/* Left: Category columns */}
                  <div className="flex-1 p-5 pr-4">
                    {CATEGORY_GROUPS.map(group => (
                      <div key={group.group} className="mb-4 last:mb-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8B5CF6] mb-2">
                          {group.group}
                        </p>
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                          {group.items.map(cat => (
                            <button
                              key={cat.value}
                              role="menuitem"
                              onMouseEnter={() => setHoveredItem(cat)}
                              onMouseLeave={() => setHoveredItem(null)}
                              onClick={() => { navigate(`/products?category=${cat.value}`); setShopOpen(false); }}
                              className={`
                                group text-left py-1.5 px-2.5 rounded-lg text-[13px] font-medium
                                transition-all duration-150 flex items-center gap-2.5
                                ${dk
                                  ? 'text-[#B0ACBE] hover:text-white hover:bg-white/[0.07]'
                                  : 'text-[#424245] hover:text-[#0B0B10] hover:bg-black/[0.05]'
                                }
                              `}
                            >
                              {/* Thumbnail */}
                              <span
                                className="w-7 h-7 rounded-md overflow-hidden flex-shrink-0 bg-white/5"
                                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
                              >
                                <img
                                  src={cat.img}
                                  alt={cat.label}
                                  loading="lazy"
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              </span>
                              <span>{cat.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* "View all" link */}
                    <button
                      onClick={() => { navigate('/products'); setShopOpen(false); }}
                      className={`mt-2.5 text-[12px] font-semibold transition-colors flex items-center gap-1 ${dk ? 'text-[#8B5CF6] hover:text-[#a78bfa]' : 'text-[#8B5CF6] hover:text-[#7c3aed]'}`}
                    >
                      <span>View all poster collections</span>
                      <span>→</span>
                    </button>
                  </div>

                  {/* Right: Large preview card */}
                  <div
                    className={`w-56 flex-shrink-0 border-l relative overflow-hidden flex flex-col justify-end ${dk ? 'border-white/[0.08] bg-[#0c0b11]' : 'border-black/[0.06] bg-[#f5f5f7]'}`}
                    style={{ minHeight: '290px' }}
                  >
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {/* Preview image with crossfade */}
                      {allItems.map(item => (
                        <img
                          key={item.value}
                          src={item.img}
                          alt={item.label}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                          style={{ opacity: previewItem?.value === item.value ? 1 : 0 }}
                        />
                      ))}
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                    </div>

                    {/* Label & CTA */}
                    <div className="relative z-10 p-4">
                      <p className="text-white font-bold text-[15px] leading-tight drop-shadow">{previewItem?.label}</p>
                      <p className="text-white/80 text-[11px] mt-0.5 leading-tight drop-shadow">{previewItem?.tagline}</p>
                      <button
                        onClick={() => { navigate(`/products?category=${previewItem?.value}`); setShopOpen(false); }}
                        className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold text-[#A78BFA] hover:text-white transition-colors"
                      >
                        Shop {previewItem?.label} →
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── High-Visibility Showcase: Home Decor & Solar Wobbler & Custom Poster ── */}
                <div className={`border-t px-4 py-3.5 ${
                  dk ? 'border-white/[0.08] bg-[#0A0910]' : 'border-black/[0.06] bg-[#f9f8fa]'
                }`}>
                  <div className="flex items-center justify-between mb-2 px-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8B5CF6]">
                      Special Collections
                    </span>
                    <span className={`text-[11px] font-medium ${dk ? 'text-white/45' : 'text-gray-500'}`}>
                      Original Creations &amp; Decor
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    {FEATURED_COLLECTIONS.map(item => {
                      const isAmber = item.badgeColor === 'amber';
                      const isPurple = item.badgeColor === 'purple';
                      
                      const cardTheme = dk
                        ? isAmber
                          ? 'border-amber-500/35 bg-amber-500/[0.08] hover:border-amber-400 hover:bg-amber-500/[0.15]'
                          : isPurple
                          ? 'border-purple-500/35 bg-purple-500/[0.08] hover:border-purple-400 hover:bg-purple-500/[0.15]'
                          : 'border-pink-500/35 bg-pink-500/[0.08] hover:border-pink-400 hover:bg-pink-500/[0.15]'
                        : isAmber
                        ? 'border-amber-300 bg-amber-50/90 hover:border-amber-500 hover:bg-amber-100'
                        : isPurple
                        ? 'border-purple-300 bg-purple-50/90 hover:border-purple-500 hover:bg-purple-100'
                        : 'border-pink-300 bg-pink-50/90 hover:border-pink-500 hover:bg-pink-100';

                      const badgeStyle = isAmber
                        ? 'bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                        : isPurple
                        ? 'bg-purple-500/25 text-purple-700 dark:text-purple-300 border border-purple-500/30'
                        : 'bg-pink-500/25 text-pink-700 dark:text-pink-300 border border-pink-500/30';

                      return (
                        <Link
                          key={item.label}
                          to={item.link}
                          onClick={() => setShopOpen(false)}
                          className={`group flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200 ${cardTheme}`}
                        >
                          <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-black/10 shadow-sm border border-black/5 dark:border-white/10">
                            <img
                              src={item.img}
                              alt={item.label}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[13px] font-bold truncate ${dk ? 'text-white' : 'text-gray-900'}`}>
                                {item.label}
                              </span>
                            </div>
                            <div className="mt-0.5">
                              <span className={`inline-block text-[9.5px] font-bold px-1.5 py-0.2 rounded-full leading-tight ${badgeStyle}`}>
                                {item.badge}
                              </span>
                            </div>
                            <p className={`text-[10.5px] truncate mt-1 ${dk ? 'text-white/70' : 'text-gray-600'}`}>
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <NavItem to="/products"      dk={dk}>All Posters</NavItem>
            <NavItem to="/customize"     dk={dk}>Customize</NavItem>
            <NavItem to="/solar-wobbler" dk={dk}>Solar Wobbler</NavItem>
            {isAuthenticated && user?.role === 'admin' && (
              <NavItem to="/admin" dk={dk}>Admin</NavItem>
            )}
          </nav>

          {/* ── Right: Search, Cart, User, Theme ── */}
          <div className="hidden md:flex items-center gap-1.5">

            {/* Search */}
            <div className="relative" ref={searchRef}>
              <div className={`
                flex items-center gap-2 px-3 py-2 rounded-full border text-[13px]
                transition-all duration-200
                focus-within:ring-2 focus-within:ring-[#8B5CF6]/30 focus-within:border-[#8B5CF6]/50
                ${dk
                  ? 'bg-white/[0.06] border-white/[0.1] text-white'
                  : 'bg-black/[0.04] border-black/[0.08] text-[#0B0B10]'
                }
              `}>
                <FiSearch className="w-3.5 h-3.5 flex-shrink-0 opacity-40" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); fetchSuggestions(e.target.value); }}
                  onKeyDown={e => { if (e.key === 'Enter') submitSearch(); if (e.key === 'Escape') setShowSuggestions(false); }}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="Search VYBE…"
                  aria-label="Search products"
                  aria-autocomplete="list"
                  className="bg-transparent outline-none w-32 lg:w-44 placeholder:opacity-40"
                />
                {searchQuery && (
                  <button onClick={() => { setSearchQuery(''); setSuggestions([]); setShowSuggestions(false); }} aria-label="Clear">
                    <FiX className="w-3.5 h-3.5 opacity-40 hover:opacity-80 transition-opacity" />
                  </button>
                )}
              </div>

              {showSuggestions && suggestions.length > 0 && (
                <div className={`absolute top-full left-0 mt-2 rounded-xl shadow-2xl border overflow-hidden z-[100] min-w-[280px] ${
                  dk ? 'bg-[#111117] border-white/[0.08]' : 'bg-white border-black/[0.08]'
                }`}>
                  <div className="max-h-72 overflow-y-auto">
                    {suggestions.map(p => (
                      <button
                        key={p._id}
                        onMouseDown={e => { e.preventDefault(); setShowSuggestions(false); setSearchQuery(''); navigate(`/products/${p._id}`); }}
                        className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors ${
                          dk ? 'hover:bg-white/[0.05] text-[#B0ACBE]' : 'hover:bg-black/[0.04] text-[#424245]'
                        }`}
                      >
                        {p.thumbnail && <img src={p.thumbnail} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" loading="lazy" />}
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-medium truncate">{cleanName(p.name)}</div>
                          <div className={`text-[11px] ${dk ? 'text-[#6B6B7A]' : 'text-[#86868B]'}`}>{p.category}</div>
                        </div>
                        {p.basePrice && <span className="text-[13px] font-semibold text-[#8B5CF6] flex-shrink-0">৳{p.basePrice}</span>}
                      </button>
                    ))}
                  </div>
                  <button
                    onMouseDown={e => { e.preventDefault(); submitSearch(); }}
                    className={`w-full py-2.5 text-[11px] font-semibold uppercase tracking-wider border-t transition-colors ${
                      dk ? 'border-white/[0.06] text-[#8B5CF6] hover:bg-white/[0.04]' : 'border-black/[0.06] text-[#8B5CF6] hover:bg-black/[0.02]'
                    }`}
                  >
                    View all results →
                  </button>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              aria-label={`Cart${itemCount > 0 ? `, ${itemCount} items` : ''}`}
              className={`nav-icon-btn ${dk ? 'nav-icon-btn--dark' : 'nav-icon-btn--light'}`}
            >
              <FiShoppingCart className="w-[18px] h-[18px]" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#8B5CF6] text-white text-[10px] font-bold flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* User */}
            <div className="relative" ref={userMenuRef}>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    aria-label="Account menu"
                    aria-expanded={userMenuOpen}
                    className={`nav-icon-btn ${dk ? 'nav-icon-btn--dark' : 'nav-icon-btn--light'}`}
                  >
                    <FiUser className="w-[18px] h-[18px]" />
                  </button>

                  <div className={`
                    absolute right-0 mt-2 w-52 rounded-2xl shadow-2xl border overflow-hidden
                    transition-all duration-150 ease-out origin-top-right
                    ${userMenuOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}
                    ${dk ? 'bg-[#111117] border-white/[0.08]' : 'bg-white border-black/[0.08]'}
                  `}>
                    <div className={`px-4 py-3.5 border-b ${dk ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
                      <p className={`text-[13px] font-semibold ${dk ? 'text-white' : 'text-[#0B0B10]'}`}>{user?.name || 'Account'}</p>
                      <p className={`text-[11px] truncate mt-0.5 ${dk ? 'text-[#6B6B7A]' : 'text-[#86868B]'}`}>{user?.email}</p>
                    </div>
                    <div className="py-1.5">
                      <DropdownItem to="/account" onClick={() => setUserMenuOpen(false)} dk={dk} icon={<FiUser />}>My Account</DropdownItem>
                      <DropdownItem to="/my-orders" onClick={() => setUserMenuOpen(false)} dk={dk} icon={<FiPackage />}>My Orders</DropdownItem>
                    </div>
                    <div className={`border-t py-1.5 ${dk ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
                      <button
                        onClick={() => { handleLogout(); setUserMenuOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors ${
                          dk ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <FiLogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full text-[13px] font-semibold bg-[#8B5CF6] text-white hover:bg-[#7C3AED] transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Theme */}
            <button
              onClick={toggleTheme}
              aria-label={dk ? 'Switch to light' : 'Switch to dark'}
              className={`nav-icon-btn ${dk ? 'nav-icon-btn--dark' : 'nav-icon-btn--light'}`}
            >
              {dk ? <FiSun className="w-[17px] h-[17px]" /> : <FiMoon className="w-[17px] h-[17px]" />}
            </button>
          </div>

          {/* ── Mobile right ── */}
          <div className="md:hidden flex items-center gap-1">
            <Link
              to="/cart"
              aria-label={`Cart${itemCount > 0 ? `, ${itemCount} items` : ''}`}
              className={`relative p-2.5 rounded-full transition-colors ${dk ? 'text-[#B0ACBE] hover:text-white' : 'text-[#424245]'}`}
            >
              <FiShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#8B5CF6] text-white text-[10px] font-bold flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className={`p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-colors ${
                dk ? 'text-[#B0ACBE] hover:bg-white/[0.08]' : 'text-[#424245] hover:bg-black/[0.06]'
              }`}
            >
              <span className="relative w-5 h-4 flex flex-col justify-between">
                <span className={`block h-0.5 rounded-full transition-all duration-300 ${dk ? 'bg-white' : 'bg-[#0B0B10]'} ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                <span className={`block h-0.5 rounded-full transition-all duration-300 ${dk ? 'bg-white' : 'bg-[#0B0B10]'} ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
                <span className={`block h-0.5 rounded-full transition-all duration-300 ${dk ? 'bg-white' : 'bg-[#0B0B10]'} ${mobileOpen ? '-rotate-45 -translate-y-[9px]' : ''}`} />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          mobileOpen ? 'max-h-[100vh] opacity-100' : 'max-h-0 opacity-0'
        } ${dk ? 'bg-[#0B0B10] border-t border-white/[0.06]' : 'bg-white border-t border-black/[0.06]'}`}
        aria-hidden={!mobileOpen}
      >
        <div className="px-5 py-5 space-y-0.5">
          {/* Mobile search */}
          <div className="relative mb-5">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-35 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); fetchSuggestions(e.target.value); }}
              onKeyDown={e => { if (e.key === 'Enter') submitSearch(); }}
              placeholder="Search products…"
              aria-label="Search"
              className={`w-full pl-10 pr-4 py-3 min-h-[48px] rounded-xl text-[14px] outline-none border transition-colors ${
                dk
                  ? 'bg-white/[0.06] border-white/[0.1] text-white placeholder:text-white/30'
                  : 'bg-black/[0.04] border-black/[0.08] text-[#0B0B10] placeholder:text-black/30'
              }`}
            />
          </div>

          <MobileItem to="/" dk={dk} onClick={() => setMobileOpen(false)}>Home</MobileItem>
          <MobileItem to="/products" dk={dk} onClick={() => setMobileOpen(false)}>All Posters</MobileItem>

          {/* Mobile shop accordion */}
          <div>
            <button
              onClick={() => setShopOpen(v => !v)}
              className={`w-full flex items-center justify-between py-3 min-h-[48px] text-[15px] font-medium transition-colors ${
                dk ? 'text-[#B0ACBE] hover:text-white' : 'text-[#424245] hover:text-[#0B0B10]'
              }`}
            >
              Browse Categories
              <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${shopOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-250 ${shopOpen ? 'max-h-[750px]' : 'max-h-0'}`}>
              {/* Special collections */}
              <div className="pt-2 pb-3 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8B5CF6] px-1">
                  Special Collections
                </p>
                {FEATURED_COLLECTIONS.map(item => (
                  <Link
                    key={item.label}
                    to={item.link}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 p-2 rounded-xl border transition-all ${
                      dk ? 'bg-white/[0.04] border-white/10 text-white' : 'bg-black/[0.02] border-black/10 text-gray-900'
                    }`}
                  >
                    <img src={item.img} alt={item.label} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[13px]">{item.label}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-[#8B5CF6]">
                          {item.badge}
                        </span>
                      </div>
                      <p className={`text-[11px] truncate mt-0.5 ${dk ? 'text-white/60' : 'text-gray-500'}`}>{item.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8B5CF6] px-1 pt-1 pb-1">
                Posters by Category
              </p>
              <div className="pb-2 grid grid-cols-2 gap-1">
                {CATEGORY_GROUPS.flatMap(g => g.items).map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => { navigate(`/products?category=${cat.value}`); setMobileOpen(false); }}
                    className={`flex items-center gap-2 py-2.5 px-2 min-h-[44px] rounded-lg text-[13px] font-medium text-left transition-colors ${
                      dk ? 'text-[#B0ACBE] hover:text-white hover:bg-white/[0.06]' : 'text-[#424245] hover:text-[#0B0B10] hover:bg-black/[0.04]'
                    }`}
                  >
                    <span className="w-6 h-6 rounded overflow-hidden flex-shrink-0">
                      <img src={cat.img} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <MobileItem to="/home-decor" dk={dk} onClick={() => setMobileOpen(false)}>Home Decor</MobileItem>
          <MobileItem to="/solar-wobbler" dk={dk} onClick={() => setMobileOpen(false)}>Solar Wobbler</MobileItem>
          <MobileItem to="/customize" dk={dk} onClick={() => setMobileOpen(false)}>Customize</MobileItem>

          {/* Auth */}
          <div className={`pt-4 mt-3 border-t space-y-0.5 ${dk ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
            {isAuthenticated ? (
              <>
                <p className={`px-1 pb-2 text-[12px] ${dk ? 'text-[#6B6B7A]' : 'text-[#86868B]'}`}>
                  Signed in as <span className={`font-semibold ${dk ? 'text-white' : 'text-[#0B0B10]'}`}>{user?.name}</span>
                </p>
                <MobileItem to="/account" dk={dk} onClick={() => setMobileOpen(false)}>My Account</MobileItem>
                <MobileItem to="/my-orders" dk={dk} onClick={() => setMobileOpen(false)}>My Orders</MobileItem>
                {user?.role === 'admin' && (
                  <MobileItem to="/admin" dk={dk} onClick={() => setMobileOpen(false)}>Admin Panel</MobileItem>
                )}
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className={`w-full text-left py-3 min-h-[48px] text-[15px] transition-colors ${dk ? 'text-red-400' : 'text-red-600'}`}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)}
                className="block w-full text-center py-3.5 rounded-xl bg-[#8B5CF6] text-white font-semibold text-[15px] hover:bg-[#7C3AED] transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Theme toggle */}
          <div className={`pt-3 mt-2 border-t ${dk ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
            <button
              onClick={toggleTheme}
              className={`flex items-center gap-2.5 py-3 min-h-[48px] text-[14px] transition-colors ${dk ? 'text-[#B0ACBE] hover:text-white' : 'text-[#424245] hover:text-[#0B0B10]'}`}
            >
              {dk ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
              {dk ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function NavItem({ to, dk, children }) {
  return (
    <Link to={to} className={`apple-nav-link ${dk ? 'apple-nav-link--dark' : 'apple-nav-link--light'}`}>
      {children}
    </Link>
  );
}

function DropdownItem({ to, onClick, dk, icon, children }) {
  return (
    <Link to={to} onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors ${
        dk ? 'text-[#B0ACBE] hover:text-white hover:bg-white/[0.05]' : 'text-[#424245] hover:text-[#0B0B10] hover:bg-black/[0.04]'
      }`}
    >
      <span className="w-4 h-4 flex-shrink-0">{icon}</span>
      {children}
    </Link>
  );
}

function MobileItem({ to, onClick, dk, children }) {
  return (
    <Link to={to} onClick={onClick}
      className={`block py-3 min-h-[48px] text-[15px] font-medium transition-colors ${
        dk ? 'text-[#B0ACBE] hover:text-white' : 'text-[#424245] hover:text-[#0B0B10]'
      }`}
    >
      {children}
    </Link>
  );
}
