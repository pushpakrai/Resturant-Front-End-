import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Sparkles, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { API } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AIChefCustomizer() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { addToCart } = useCart();

  const handleGenerate = async (e) => {
    e.preventDefault();
    if(!input.trim()) return;
    
    setLoading(true);
    setResult(null);
    try {
      // In production hitting the custom-ai backend
      const res = await axios.post(`${API}/custom-ai/generate-dish`, { input });
      setResult(res.data);
      toast.success("Culinary masterpiece generated!");
    } catch (err) {
      toast.error("The AI Chef is busy making curry. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if(!result) return;
    addToCart(result, result.category);
  };

  return (
    <section className="bg-[url('https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center bg-fixed relative border-y border-gold/30">
      <div className="absolute inset-0 bg-deep/90 backdrop-blur-[2px]" />
      
      <div className="relative z-10 max-w-5xl mx-auto py-24 px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        <div className="text-left">
          <div className="inline-flex items-center gap-2 border border-gold/50 bg-black/40 px-4 py-1.5 mb-6 rounded-full backdrop-blur-md">
            <Sparkles size={14} className="text-gold-light" />
            <span className="text-gold text-[10px] tracking-widest uppercase font-medium">World First Feature</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cream font-light leading-tight mb-6">
            Invent Your Own<br/>
            <em className="text-gold-light drop-shadow-[0_0_10px_rgba(201,168,76,0.5)]">AI Custom Dish</em>
          </h2>
          <p className="text-cream/70 text-base md:text-lg font-light leading-relaxed mb-8">
            Tell our Diamond AI Chef exactly what you're craving. It will mathematically design a unique dish just for you, price it, and let you order it instantly via Razorpay.
          </p>
          
          <form onSubmit={handleGenerate} className="flex flex-col gap-4">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. 'I want a spicy chicken fusion with pineapple and no dairy, extra crispy...'"
              rows="3"
              className="w-full bg-black/50 border border-gold/30 p-4 font-sans text-cream text-sm focus:outline-none focus:border-gold transition-colors resize-none placeholder:text-cream/30"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="bg-gold text-deep font-medium uppercase tracking-[0.15em] text-xs py-4 px-8 self-start flex items-center gap-2 hover:bg-gold-light transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(201,168,76,0.2)]"
            >
              <Sparkles size={16} />
              {loading ? "Engineering Receipt..." : "Generate Magic"}
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center min-h-[300px]">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.div
                  animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="w-16 h-16 border-t-2 border-r-2 border-gold rounded-full"
                />
                <span className="text-gold-light text-xs tracking-[0.2em] uppercase animate-pulse">Computing flavours...</span>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 30, rotateX: 20 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
                className="w-full glass-panel p-8 relative overflow-hidden group perspective-1000"
              >
                {/* Visual gloss overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                
                <div className="flex justify-between items-start mb-6">
                  <span className="text-4xl">{result.emoji}</span>
                  <div className="text-right">
                    <span className="block text-gold text-[10px] tracking-widest uppercase mb-1">{result.category}</span>
                    <span className="font-serif text-3xl text-cream font-light tracking-wide">₹{result.price}</span>
                  </div>
                </div>

                <h3 className="font-serif text-2xl lg:text-3xl text-gold-light leading-tight mb-4">{result.name}</h3>
                <p className="text-cream/60 text-sm font-light leading-relaxed italic border-l border-gold/30 pl-4 mb-8">
                  "{result.description}"
                </p>

                <button 
                  onClick={handleAddToCart}
                  className="w-full border border-gold bg-gold/10 hover:bg-gold hover:text-deep text-gold text-xs font-semibold tracking-widest uppercase py-4 transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-[0_0_30px_rgba(201,168,76,0.3)]"
                >
                  <ShoppingBag size={16} /> Add to Cart Custom Order
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="w-full aspect-[4/3] border border-dashed border-gold/20 flex flex-col items-center justify-center text-center p-8 bg-black/20"
              >
                <Sparkles size={32} className="text-gold/20 mb-4" />
                <p className="text-cream/40 font-serif text-lg font-light italic">Your culinary masterpiece will appear here.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
