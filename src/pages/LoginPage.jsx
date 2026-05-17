import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { LogIn, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      toast.success("Welcome back to your sanctuary.");
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (e) {
      toast.error(e.response?.data?.message || "Our treasury could not verify your presence.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory dark:bg-deep text-deep dark:text-cream flex items-center justify-center p-6 pt-40 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[45rem] text-gold/5 font-serif pointer-events-none select-none z-0 rotate-12">
        ◇
      </div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-wine/10 blur-[150px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="glass-panel w-full max-w-md p-10 md:p-14 relative z-10"
      >
        <div className="text-center mb-12">
          <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay: 0.3, type: "spring" }} className="inline-block text-gold mb-4">
             <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center">
                <LogIn size={20} />
             </div>
          </motion.div>
          <h2 className="text-4xl font-light text-deep dark:text-cream mb-2">Sign In</h2>
          <p className="text-gold text-[9px] tracking-[0.4em] uppercase font-bold opacity-60">Royal Access Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-deep/45 dark:text-cream/30 ml-1">Registry Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-black/5 dark:bg-black/40 border border-gold/10 p-4 text-deep dark:text-cream focus:border-gold outline-none transition-all text-sm font-light"
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[0.2em] text-deep/45 dark:text-cream/30 ml-1">Security Code</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-black/5 dark:bg-black/40 border border-gold/10 p-4 text-deep dark:text-cream focus:border-gold outline-none transition-all text-sm font-light"
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-gold !py-5 flex items-center justify-center gap-3 group"
          >
            {loading ? 'Authenticating...' : 'Access Sanctuary'} <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </form>

        <div className="mt-12 text-center">
           <p className="text-deep/40 dark:text-cream/30 text-[10px] uppercase tracking-[0.2em] mb-4">New To The Diamond Queen?</p>
           <Link to="/register" className="text-gold hover:text-white transition-colors text-xs font-bold border-b border-gold/20 pb-1">
             Request Royal Membership →
           </Link>
        </div>
      </motion.div>
    </div>
  );
}
