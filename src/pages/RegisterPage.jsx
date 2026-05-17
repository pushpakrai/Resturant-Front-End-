import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { UserPlus, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await register(name, email, password);
      toast.success("Welcome to the Diamond Elite.");
      navigate('/');
    } catch (e) {
      if (e.response?.data?.errors && e.response.data.errors.length > 0) {
        toast.error(e.response.data.errors[0].msg);
      } else {
        toast.error(e.response?.data?.message || "Membership registry is momentarily full.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory dark:bg-deep text-deep dark:text-cream flex items-center justify-center p-6 pt-40 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[45rem] text-gold/5 font-serif pointer-events-none select-none z-0 -rotate-12">
        ◇
      </div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold/10 blur-[150px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        className="glass-panel w-full max-w-md p-10 md:p-14 relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ delay: 0.3, type: "spring" }} className="inline-block text-gold mb-4">
             <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center">
                <UserPlus size={20} />
             </div>
          </motion.div>
          <h2 className="text-4xl font-light text-deep dark:text-cream mb-2">Membership</h2>
          <p className="text-gold text-[9px] tracking-[0.4em] uppercase font-bold opacity-60">Join The Diamond Elite</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-[0.2em] text-deep/45 dark:text-cream/30 ml-1">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)}
              className="w-full bg-black/5 dark:bg-black/40 border border-gold/10 p-4 text-deep dark:text-cream focus:border-gold outline-none transition-all text-sm font-light"
              required 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-[0.2em] text-deep/45 dark:text-cream/30 ml-1">Email Identity</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-black/5 dark:bg-black/40 border border-gold/10 p-4 text-deep dark:text-cream focus:border-gold outline-none transition-all text-sm font-light"
              required 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] uppercase tracking-[0.2em] text-deep/45 dark:text-cream/30 ml-1">Security Pass</label>
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
            className="w-full btn-gold !py-5 flex items-center justify-center gap-3 group mt-4"
          >
            {loading ? 'Creating Identity...' : 'Confirm Membership'} <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </form>

        <div className="mt-12 text-center border-t border-gold/5 pt-8">
           <p className="text-deep/40 dark:text-cream/30 text-[9px] uppercase tracking-[0.2em] mb-4">Already A Known Guest?</p>
           <Link to="/login" className="text-gold hover:text-white transition-colors text-xs font-bold">
             Return To Registry →
           </Link>
        </div>
      </motion.div>
    </div>
  );
}
