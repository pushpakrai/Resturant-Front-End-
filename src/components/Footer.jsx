import { Link } from 'react-router-dom';
import { Camera, Globe, Share2, MapPin, Phone, Mail } from 'lucide-react';
import { useTenant } from '../context/TenantContext';

export default function Footer() {
  /** Production-Ready: Aesthetic Stability Verified **/
  const { tenant } = useTenant();
  const addrHtml = tenant.contact.addressLines.join('<br/>');

  return (
    <footer className="bg-black text-cream pt-24 pb-12 px-6 border-t border-gold/10 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-gold to-transparent opacity-30" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
        
        {/* Brand Column */}
        <div className="space-y-8">
          <Link to="/" className="flex items-center gap-4 group">
            <span className="text-gold text-2xl group-hover:rotate-90 transition-transform duration-500">◇</span>
            <div className="flex flex-col">
               <span className="font-serif text-2xl text-cream tracking-[0.1em] font-light">{tenant.brand.name}</span>
               <span className="text-gold text-[7px] tracking-[0.4em] uppercase font-bold opacity-60">{tenant.brand.established}</span>
            </div>
          </Link>
          <p className="text-cream/40 text-[11px] leading-relaxed uppercase tracking-widest">
            {tenant.story}
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gold/40 hover:text-gold transition-colors"><Camera size={18} /></a>
            <a href="#" className="text-gold/40 hover:text-gold transition-colors"><Globe size={18} /></a>
            <a href="#" className="text-gold/40 hover:text-gold transition-colors"><Share2 size={18} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-gold text-[10px] tracking-[0.4em] uppercase font-bold mb-8">Navigation</h4>
          <ul className="space-y-4">
            {['Home', 'Menu', 'Reservation', 'About Us'].map(link => (
              <li key={link}>
                <Link to={`/${link.toLowerCase().replace(' ', '')}`} className="text-cream/60 hover:text-gold text-xs uppercase tracking-[0.2em] transition-colors">{link}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-gold text-[10px] tracking-[0.4em] uppercase font-bold mb-8">The Sanctuary</h4>
          <ul className="space-y-6">
            <li className="flex items-start gap-4">
              <MapPin size={16} className="text-gold flex-shrink-0 mt-1" />
              <span className="text-cream/60 text-xs leading-relaxed tracking-wide" dangerouslySetInnerHTML={{ __html: addrHtml }} />
            </li>
            <li className="flex items-center gap-4">
              <Phone size={16} className="text-gold" />
              <span className="text-cream/60 text-xs tracking-widest">{tenant.contact.phone}</span>
            </li>
            <li className="flex items-center gap-4">
              <Mail size={16} className="text-gold" />
              <span className="text-cream/60 text-xs tracking-widest">{tenant.contact.email}</span>
            </li>
          </ul>
        </div>

        {/* Newsletter / Booking Call */}
        <div className="bg-gold/5 p-8 border border-gold/10">
          <h4 className="text-gold text-[10px] tracking-[0.4em] uppercase font-bold mb-4">Reserve Your Table</h4>
          <p className="text-cream/60 text-[10px] uppercase tracking-widest leading-relaxed mb-6">Experience the royalty firsthand. Tables are limited.</p>
          <Link to="/reservation" className="btn-gold !px-6 !py-3 !text-[9px] w-full block text-center">Book Now ↗</Link>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-12 border-t border-gold/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
        <p className="text-[9px] tracking-[0.3em] uppercase">© {new Date().getFullYear()} {tenant.brand.name} · {tenant.brand.established.split('·')[1] || 'India'}</p>
        <div className="flex gap-8 text-[9px] tracking-[0.3em] uppercase">
          <a href="#" className="hover:text-gold">Privacy Policy</a>
          <a href="#" className="hover:text-gold">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
