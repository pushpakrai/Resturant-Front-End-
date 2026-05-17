import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTenant } from '../context/TenantContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut, Menu, X, Crown, Moon, Sun, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const { tenant } = useTenant();
  const { cart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Reserve', path: '/reservation' },
    { name: 'Royalty', path: '/royalty' }
  ];

  const solidBar = scrolled || !isHome || mobileOpen;
  const onDarkHero = isHome && !scrolled && !mobileOpen;

  const linkClass = (path) => {
    const active = location.pathname === path;
    if (onDarkHero) {
      return `text-[10px] uppercase tracking-[0.25em] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-px after:bg-gold after:transition-all hover:after:w-full ${
        active ? 'text-gold after:w-full' : 'text-cream/75 hover:text-gold after:w-0'
      }`;
    }
    return `nav-link ${active ? '!text-gold' : ''}`;
  };

  return (
    <>
      <nav
        className={`
        fixed w-full z-50 transition-all duration-700 ease-[cubic-bezier(0.22, 1, 0.36, 1)]
        ${
          solidBar
            ? 'bg-ivory/95 dark:bg-deep/80 backdrop-blur-2xl py-4 border-b border-gold/10'
            : 'bg-transparent py-8 border-b border-transparent'
        }
      `}
      >
        <div className="max-w-[1500px] mx-auto px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-4 group">
            <motion.div
              whileHover={{ rotate: 90 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-10 h-10 flex-shrink-0"
            >
              <img
                src="/logo.svg"
                alt=""
                className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(201,168,76,0.35)]"
                width={40}
                height={40}
              />
            </motion.div>
            <div className="flex flex-col">
              <span
                className={`font-serif text-2xl tracking-[0.1em] font-light group-hover:text-gold transition-colors duration-500 ${
                  onDarkHero ? 'text-cream' : 'text-deep dark:text-cream'
                }`}
              >
                {tenant.brand.name}
              </span>
              <span className="text-gold text-[7px] tracking-[0.4em] uppercase font-bold opacity-60">
                {tenant.brand.tagline}
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            <div className="flex gap-10">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} className={linkClass(link.path)}>
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-6 pl-8 border-l border-gold/10">
              <button
                type="button"
                onClick={toggleTheme}
                className={`p-2 rounded-full border border-gold/20 hover:border-gold/50 transition-colors ${
                  onDarkHero ? 'text-cream' : 'text-deep dark:text-cream'
                }`}
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <Link to="/admin" className="text-deep/60 hover:text-gold dark:text-cream/50 dark:hover:text-gold transition-colors flex items-center gap-1">
                <User size={18} />
                <span className="hidden lg:inline text-xs mt-1 uppercase">Admin</span>
              </Link>

              <Link to="/cart" className="relative group p-2">
                <ShoppingCart
                  size={18}
                  className={
                    onDarkHero
                      ? 'text-cream group-hover:text-gold transition-colors'
                      : 'text-deep dark:text-cream group-hover:text-gold transition-colors'
                  }
                />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-wine text-cream text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-gold/20"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>

              {user ? (
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="text-gold text-[9px] uppercase tracking-widest font-bold">Royal Guest</span>
                    <span
                      className={`text-[11px] font-serif italic ${
                        onDarkHero ? 'text-cream/70' : 'text-deep/70 dark:text-cream/70'
                      }`}
                    >
                      {user?.name ? user.name.split(' ')[0] : 'Admin'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className={`transition-colors p-2 ${
                      onDarkHero ? 'text-cream/40 hover:text-wine' : 'text-deep/40 dark:text-cream/30 hover:text-wine'
                    }`}
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-8 items-center">
                  <Link
                    to="/login"
                    className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-all hover:text-gold ${
                      onDarkHero ? 'text-cream/65' : 'text-deep/65 dark:text-cream/60'
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-gold !py-3 !px-6 !text-[9px]">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="text-gold hover:text-gold-light transition-colors p-2"
              aria-label={dark ? 'Light mode' : 'Dark mode'}
            >
              {dark ? <Sun size={22} /> : <Moon size={22} />}
            </button>
            <button
              type="button"
              className="text-gold hover:text-gold-light transition-colors p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            className="fixed inset-0 bg-ivory dark:bg-deep z-40 flex flex-col justify-center items-center gap-10 text-deep dark:text-cream"
          >
            <div className="absolute top-10 left-10 flex items-center gap-3 opacity-20">
              <Crown size={40} className="text-gold" />
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className="font-serif text-4xl md:text-5xl hover:text-gold transition-all font-light"
              >
                {link.name}
              </Link>
            ))}

            <Link
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className="font-serif text-2xl text-gold-light flex items-center gap-4"
            >
              Order List ({cartCount})
            </Link>

            <div className="w-24 h-px bg-gold/20 my-4" />

            {user ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="text-wine tracking-[0.3em] uppercase text-[10px] font-bold"
              >
                Logout From Sanctuary
              </button>
            ) : (
              <div className="flex flex-col gap-10 items-center">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="tracking-[0.3em] uppercase text-xs opacity-80"
                >
                  Access Account
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-gold !px-12">
                  Join The Diamond Elite
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
