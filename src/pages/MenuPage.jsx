import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '../context/CartContext';
import { useTenant } from '../context/TenantContext';
import axios from 'axios';
import { API } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ShoppingCart, Plus, Minus, ChefHat } from 'lucide-react';
import PremiumImage from '../components/PremiumImage';

export default function MenuPage() {
  const { tenant } = useTenant();
  const [activeCategory, setActiveCategory] = useState('');
  const { addToCart, updateQuantity, cart } = useCart();

  // Fetch Categories
  const { data: categories = [], isLoading: catsLoading } = useQuery({
    queryKey: ['categories', tenant.id],
    queryFn: async () => {
      const r = await axios.get(`${API}/menu/categories`);
      return r.data;
    },
  });

  // Ensure first category is selected immediately on load
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  // Fetch Menu Items
  const { data: menuItems = [], isLoading: menuLoading } = useQuery({
    queryKey: ['menu', tenant.id],
    queryFn: async () => {
      const r = await axios.get(`${API}/menu`);
      return r.data;
    },
    onError: () => toast.error("Our chefs are currently refining the menu selections.")
  });

  const loading = catsLoading || menuLoading;

  const currentCategoryObj = menuItems.find((item) => item.category === activeCategory);
  const itemsToDisplay = currentCategoryObj ? currentCategoryObj.items : [];

  const getItemQuantity = (name) => {
    const item = cart.find(c => c.name === name);
    return item ? item.quantity : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory dark:bg-deep pt-40 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="w-1/3 h-12 bg-gold/10 animate-pulse mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[4/5] bg-deep-accent/20 animate-pulse rounded-lg border border-gold/5" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory dark:bg-deep pt-40 pb-32 text-deep dark:text-cream">
      {/* 👑 MENU HEADER */}
      <div className="max-w-7xl mx-auto px-6 text-center mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="text-gold text-[10px] tracking-[0.4em] uppercase mb-4">{tenant.brand.heroBadge}</p>
          <h1 className="text-6xl md:text-8xl font-light mb-8">
            The <em className="text-gold-light">{tenant.brand.name.split(' ').pop()}</em> Selection
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto" />
        </motion.div>
      </div>

      {/* 🏺 CATEGORY NAVIGATION */}
      <div className="sticky top-24 z-40 bg-ivory/90 dark:bg-deep/80 backdrop-blur-md py-6 mb-16 border-y border-gold/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`
                text-[10px] tracking-[0.3em] uppercase transition-all duration-500 relative py-2
                ${activeCategory === cat ? 'text-gold' : 'text-deep/45 hover:text-deep dark:text-cream/40 dark:hover:text-cream'}
              `}
            >
              {cat}
              {activeCategory === cat && (
                <motion.div layoutId="activeCat" className="absolute bottom-0 left-0 right-0 h-px bg-gold" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 🍽️ ITEMS GRID */}
      <div className="max-w-7xl mx-auto px-6">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <AnimatePresence mode="popLayout">
            {itemsToDisplay.map((item, idx) => {
              const qty = getItemQuantity(item.name);
              return (
                <motion.div 
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  className="premium-card group"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <PremiumImage
                      src={item.imageUrl}
                      alt={item.name}
                      emoji={currentCategoryObj?.emoji}
                      photographer={item.photographer}
                      downloadLocation={item.downloadLocation}
                      className="w-full h-full"
                      imgClassName="group-hover:scale-110 transition-transform duration-1000 opacity-75 group-hover:opacity-100"
                    />
                  </div>
                  
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl text-deep dark:text-cream group-hover:text-gold transition-colors">{item.name}</h3>
                      <span className="text-gold font-serif text-xl">₹{item.price}</span>
                    </div>
                    <p className="text-deep/55 dark:text-cream/50 text-xs leading-relaxed font-light mb-8 h-10 overflow-hidden line-clamp-2">
                      {item.desc || "Experience a Masterpiece of Pune's Culinary Heritage."}
                    </p>

                    <div className="flex items-center justify-between gap-4">
                      {qty > 0 ? (
                        <div className="flex items-center gap-6 bg-black/5 dark:bg-black/40 border border-gold/20 px-4 py-2">
                          <button onClick={() => updateQuantity(item._id || item.name, -1)} className="text-gold-light hover:text-white"><Minus size={14} /></button>
                          <span className="text-xs font-bold w-4 text-center">{qty}</span>
                          <button onClick={() => updateQuantity(item._id || item.name, 1)} className="text-gold-light hover:text-white"><Plus size={14} /></button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => addToCart(item)}
                          className="w-full border border-gold/40 text-gold hover:bg-gold hover:text-deep uppercase tracking-widest text-[10px] font-bold py-3 transition-all duration-500 flex items-center justify-center gap-2"
                        >
                          <ShoppingCart size={14} /> Add to Order
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {itemsToDisplay.length === 0 && (
          <div className="text-center py-40">
            <p className="font-serif italic text-2xl text-deep/35 dark:text-cream/30">Refining our seasonal selections...</p>
          </div>
        )}
      </div>

    </div>
  );
}
