import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function OrderSuccessPage() {
  const location = useLocation();
  const total = location.state?.total;
  const demo = location.state?.demo;

  return (
    <div className="min-h-screen bg-ivory dark:bg-deep flex flex-col items-center justify-center px-6 pt-32 pb-24 text-center text-deep dark:text-cream">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg"
      >
        <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-10 border border-gold/40">
          <CheckCircle2 className="text-gold w-10 h-10" strokeWidth={1.25} />
        </div>
        <p className="text-gold text-[10px] tracking-[0.4em] uppercase mb-4">Order received</p>
        <h1 className="font-serif text-4xl md:text-5xl font-light mb-6">Thank you, valued guest</h1>
        {total != null && (
          <p className="text-gold-light font-serif text-3xl mb-4">₹{total}</p>
        )}
        <p className="text-deep/70 dark:text-cream/60 text-sm leading-relaxed mb-10">
          {demo
            ? 'This was a sandbox payment. With live Razorpay keys, the same flow charges for real.'
            : 'Your kitchen ticket is in motion. We will send confirmation to your registered email when enabled.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/menu" className="btn-gold">
            Order again
          </Link>
          <Link
            to="/royalty"
            className="text-[10px] uppercase tracking-[0.25em] text-gold border-b border-gold/40 pb-1 flex items-center gap-2 hover:border-gold"
          >
            <Sparkles size={14} /> Royal dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
