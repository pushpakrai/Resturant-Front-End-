import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import DiamondHero3D from '../components/DiamondHero3D';
import AIChefCustomizer from '../components/AIChefCustomizer';
import PremiumImage from '../components/PremiumImage';
import { Sparkles } from 'lucide-react';

function RevealSection({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: delay / 1000 }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const { tenant } = useTenant();
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const { data: aiRec } = useQuery({
    queryKey: ['ai-recommendations', tenant.id],
    queryFn: async () => {
      const r = await axios.get(`${API}/ai/recommendations`);
      return r.data;
    },
    staleTime: 1000 * 60 * 10,
  });

  const menuHighlights = [
    {
      emoji: '🥞',
      name: 'Morning Specials',
      type: 'Breakfast',
      desc: 'Authentic Poha & Masala Chai',
      img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=85&w=900&h=700',
    },
    {
      emoji: '🍛',
      name: 'Handi Biryani',
      type: 'Signature',
      desc: 'Slow-cooked aromatic joy',
      img: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&q=85&w=900&h=700',
    },
    {
      emoji: '🍗',
      name: 'Butter Chicken',
      type: 'Classic',
      desc: 'Silky tomato gravy & tender tandoor chicken',
      img: 'https://images.unsplash.com/photo-1603894584373-5ac82b6ae398?auto=format&fit=crop&q=85&w=900&h=700',
    },
    {
      emoji: '🍌',
      name: 'Nana Banana',
      type: 'Chef Special',
      desc: 'Caramelized toffee banana delight',
      img: tenant.brand.name.includes('Queen')
        ? 'https://images.unsplash.com/photo-1528448780762-2b63df99081e?auto=format&fit=crop&q=85&w=900&h=700'
        : 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=85&w=900&h=700',
    },
  ];

  return (
    <div className="bg-ivory dark:bg-deep text-deep dark:text-cream overflow-x-hidden">
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden bg-deep text-cream"
      >
        <DiamondHero3D />

        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(201,168,76,0.15),transparent_70%)] pointer-events-none"
          style={{ scale: glowScale }}
        />
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

        <motion.div
          className="relative z-10 text-center px-6 max-w-6xl mx-auto will-change-transform"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            <span className="inline-block border border-gold/40 text-gold text-[10px] tracking-[0.4em] uppercase px-6 py-2 mb-8 backdrop-blur-md bg-black/40">
              {tenant.brand.heroBadge}
            </span>

            <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-light leading-[1.1] text-cream mb-8">
              The <em className="text-gold-light block md:inline">{tenant.brand.name.split(' ')[1] || 'Royal'}</em>
              <br /> Experience
            </h1>

            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center mt-12">
              <Link to="/reservation" className="btn-gold animate-pulse-gold">
                Reserve A Table
              </Link>
              <Link
                to="/menu"
                className="text-cream/50 uppercase tracking-[0.3em] text-[10px] border-b border-cream/20 pb-1 hover:text-gold hover:border-gold transition-all duration-500"
              >
                Explore Culinary Art →
              </Link>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
        >
          <span className="text-[10px] uppercase tracking-widest text-gold text-center">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent" />
        </motion.div>
      </section>

      <section className="bg-neutral-950 text-cream py-32 px-6 dark:bg-black">
        <div className="max-w-7xl mx-auto">
          <RevealSection>
            <div className="flex flex-col md:flex-row justify-between items-end mb-20">
              <div className="max-w-2xl">
                <p className="text-gold text-[10px] tracking-[0.3em] uppercase mb-4">Curated Delights</p>
                <h2 className="text-5xl md:text-7xl font-light leading-tight">
                  Symphony of <em className="text-gold-light italic">Flavours</em>
                </h2>
              </div>
              <Link
                to="/menu"
                className="hidden md:block text-gold text-xs tracking-widest uppercase hover:translate-x-2 transition-transform"
              >
                View Full Menu ↗
              </Link>
            </div>
          </RevealSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {menuHighlights.map((item, i) => (
              <RevealSection key={item.name} delay={i * 100}>
                <div className="premium-card aspect-[4/5] group relative bg-deep border-gold/10">
                  <PremiumImage
                    src={item.img}
                    alt={item.name}
                    emoji={item.emoji}
                    className="absolute inset-0 w-full h-full"
                    imgClassName="opacity-40 group-hover:scale-110 group-hover:opacity-80 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-8 left-8 right-8 z-10 transition-transform duration-500 group-hover:-translate-y-2">
                    <span className="text-gold-light text-[9px] tracking-[0.4em] uppercase mb-2 block opacity-70">{item.type}</span>
                    <h3 className="text-2xl mb-2 text-cream">{item.name}</h3>
                    <p className="text-cream/40 text-xs font-light tracking-wide">{item.desc}</p>
                  </div>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {aiRec && (
        <section className="py-20 px-6 border-y border-gold/10 bg-ivory/80 dark:bg-deep-accent/50">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gold text-[10px] tracking-[0.35em] uppercase mb-4">{tenant.brand.conciergeName} picks</p>
            <p className="font-serif text-2xl md:text-3xl font-light text-deep dark:text-cream mb-6">{aiRec.message}</p>
            <div className="flex flex-wrap justify-center gap-3">
              {aiRec.items?.map((name) => (
                <span
                  key={name}
                  className="text-[10px] uppercase tracking-widest px-4 py-2 border border-gold/30 rounded-full text-gold"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <AIChefCustomizer />

      <section className="relative py-40 px-6 bg-ivory dark:bg-deep">
        <div
          className="absolute inset-0 parallax-bg opacity-25 dark:opacity-20"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=2000')"
          }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <RevealSection>
            <h2 className="text-5xl md:text-7xl mb-12">
              Visit The <em className="text-gold-light">{tenant.brand.name.split(' ').pop()}</em>
            </h2>
            <div className="glass-panel p-12 text-left grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h4 className="text-gold text-xs tracking-widest uppercase mb-4">Location</h4>
                <p className="text-lg font-light leading-relaxed">
                  {tenant.contact.addressLines[0]}
                  <br />
                  {tenant.contact.addressLines[1]}
                </p>
              </div>
              <div>
                <h4 className="text-gold text-xs tracking-widest uppercase mb-4">Contact</h4>
                <p className="text-lg font-light leading-relaxed">
                  Admin: {tenant.contact.phone}
                  <br />
                  Mail: {tenant.contact.email}
                </p>
              </div>
            </div>
            <div className="mt-12">
              <Link to="/reservation" className="btn-gold">
                Book Your Experience
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>

      <section className="py-24 px-6 bg-gradient-to-b from-gold/10 to-transparent border-y border-gold/10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div>
            <div className="flex items-center gap-2 text-gold mb-4">
              <Sparkles size={18} />
              <span className="text-[10px] uppercase tracking-[0.35em]">Royal guest</span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light mb-4">Diamond Points await</h2>
            <p className="text-deep/65 dark:text-cream/55 text-sm max-w-md leading-relaxed">
              Complete checkout to earn points on every order. View your tier, history, and balance on your personal
              royal dashboard.
            </p>
          </div>
          <Link to="/royalty" className="btn-gold whitespace-nowrap">
            Open dashboard
          </Link>
        </div>
      </section>

      <section className="py-32 px-6 border-y border-gold/10">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <RevealSection>
            <div className="text-center mb-16">
              <span className="text-gold text-2xl">“</span>
              <blockquote className="text-3xl md:text-5xl font-serif italic font-light text-deep/90 dark:text-cream/90 leading-tight mb-8">
                Best Irani tea and Parsi food in town. The Diamond Queen truly lives up to its legendary name.
              </blockquote>
              <p className="text-gold tracking-[0.2em] text-xs uppercase">— Rahul S., Food Critic</p>
            </div>
          </RevealSection>
        </div>
      </section>
    </div>
  );
}
