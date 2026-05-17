import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Sparkles, ArrowLeft } from 'lucide-react';
import { getDiamondHistory, getDiamondPoints, getRoyalTier } from '../utils/loyalty';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API } from '../context/AuthContext';

export default function RoyaltyPage() {
  const { user } = useAuth();
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState([]);
  const [tier, setTier] = useState({ name: 'Guest', next: 500 });

  useEffect(() => {
    // If logged in, fetch live points from backend; otherwise use localStorage
    if (user) {
      axios.get(`${API}/auth/me`)
        .then(res => {
          const livePoints = res.data.user?.loyaltyPoints ?? getDiamondPoints();
          setPoints(livePoints);
          setTier(getRoyalTier(livePoints));
        })
        .catch(() => {
          const p = getDiamondPoints();
          setPoints(p);
          setTier(getRoyalTier(p));
        });
    } else {
      const p = getDiamondPoints();
      setPoints(p);
      setTier(getRoyalTier(p));
    }
    setHistory(getDiamondHistory());
  }, [user]);

  const toNext = tier.next != null ? Math.max(0, tier.next - points) : 0;

  return (
    <div className="min-h-screen bg-ivory dark:bg-deep pt-36 pb-24 px-6 text-deep dark:text-cream">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-gold mb-12 hover:opacity-80"
        >
          <ArrowLeft size={14} /> Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 text-gold mb-4">
            <Crown size={22} />
            <span className="text-[10px] tracking-[0.35em] uppercase">Royal guest programme</span>
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-light mb-2">Diamond Points</h1>
          <p className="text-deep/60 dark:text-cream/50 text-sm mb-12 max-w-xl">
            {user ? 'Your live loyalty balance — earned from every completed order.' : 'Sign in to sync your Diamond Points across devices.'}
          </p>

          <div className="premium-card p-10 mb-10 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-2">Your balance</p>
            <p className="font-serif text-6xl text-gold-light mb-2">{points}</p>
            <p className="text-sm flex items-center justify-center gap-2 text-deep/70 dark:text-cream/60">
              <Sparkles size={16} className="text-gold" />
              Tier: <span className="text-gold font-medium">{tier.name}</span>
            </p>
            {tier.next != null && (
              <p className="text-xs text-deep/50 dark:text-cream/40 mt-4">
                {toNext} points to reach the next tier
              </p>
            )}
          </div>

          <h2 className="text-gold text-[10px] uppercase tracking-[0.3em] mb-6">Recent activity</h2>
          <ul className="space-y-3">
            {history.length === 0 && (
              <li className="text-deep/45 dark:text-cream/35 text-sm italic">Complete an order to see history here.</li>
            )}
            {history.map((h, i) => (
              <li
                key={`${h.at}-${i}`}
                className="glass-panel px-5 py-4 flex justify-between items-center text-sm"
              >
                <span className="text-deep/60 dark:text-cream/50">
                  {new Date(h.at).toLocaleString()}
                </span>
                <span className="text-gold">
                  +{h.points} <span className="text-deep/40 dark:text-cream/40 text-xs">(₹{h.orderTotal})</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-14 text-center">
            <Link to="/menu" className="btn-gold">
              Earn more points
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
