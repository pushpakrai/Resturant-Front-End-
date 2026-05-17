import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShieldCheck, ArrowRight, CreditCard, Clock } from 'lucide-react';
import axios from 'axios';
import { useAuth, API } from '../context/AuthContext';
import { useTenant } from '../context/TenantContext';
import toast from 'react-hot-toast';
import PremiumImage from '../components/PremiumImage';
import { addDiamondPoints } from '../utils/loyalty';

export default function CartPage() {
  /** Production-Ready: Final Stability Patch Applied **/
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { tenant } = useTenant();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleCheckout = async () => {
    if (!window.Razorpay) {
      toast.error('Secure payment gateway is still loading. Please wait a moment.');
      return;
    }

    const totalRupees = getCartTotal();
    try {
      setLoading(true);
      const res = await axios.post(`${API}/payment/create-order`, {
        amount: totalRupees,
        currency: 'INR',
      });
      const data = res.data;

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: data.businessName || tenant.brand.name,
        description: data.description || tenant.brand.tagline,
        order_id: data.id,
        handler: async (response) => {
          setLoading(true);
          try {
            await runVerification(
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              totalRupees
            );
          } catch (e) {
            toast.error('Payment verification failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || 'Valued Guest',
          email: (user?.email || tenant.contact.email).toLowerCase(),
          contact: user?.phone?.replace(/\s+/g, '') || '', // Clean phone for Razorpay
        },
        theme: { color: tenant.brand.primaryColor || '#C9A84C' },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (e) {
      console.error('Checkout failure', { message: e.message });
      toast.error(e.response?.data?.message || 'Payment treasury is momentarily unavailable.');
      setLoading(false);
    }
  };

  const runVerification = async (body, totalRupees) => {
    const verifyRes = await axios.post(`${API}/payment/verify-signature`, body);
    if (!verifyRes.data.success) throw new Error('Invalid signature');

    // Production Step: Confirm order and trigger receipt
    await axios.post(`${API}/menu/confirm-order`, {
      orderId: body.razorpay_order_id,
      cart,
      total: totalRupees,
      email: user?.email || tenant.contact.email,
    });

    addDiamondPoints(totalRupees);
    toast.success('Order Placed Successfully');
    clearCart();
    navigate('/order-success', { state: { total: totalRupees, demo: false } });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-ivory dark:bg-deep flex flex-col items-center justify-center text-center p-6 pt-40 text-deep dark:text-cream">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-24 h-24 bg-black/10 dark:bg-black/40 rounded-full flex items-center justify-center mb-8 shadow-2xl border border-gold/20 mx-auto">
            <span className="text-gold text-4xl">🏺</span>
          </div>
          <h2 className="text-5xl font-light mb-4 text-deep dark:text-cream">Your Table Is Empty</h2>
          <p className="text-gold text-[10px] tracking-[0.3em] uppercase mb-12 text-deep/60 dark:text-cream/50">
            Every {tenant.brand.name} journey starts with a choice.
          </p>
          <Link to="/menu" className="btn-gold">
            Explore The Selection
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory dark:bg-deep pt-48 pb-32 px-6 text-deep dark:text-cream">
      <div className="max-w-7xl mx-auto">

        <header className="mb-20 text-deep dark:text-cream">
          <p className="text-gold text-[10px] tracking-[0.4em] uppercase mb-4">Final Selections</p>
          <h1 className="text-5xl md:text-7xl font-light">
            Your <em className="text-gold-light italic">Golden</em> Order
          </h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  key={item._id || item.name}
                  className="premium-card flex flex-col md:flex-row items-center gap-8 p-6"
                >
                  <div className="w-full md:w-32 h-32 overflow-hidden flex-shrink-0 border border-gold/10">
                    <PremiumImage
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full"
                      imgClassName="opacity-90"
                    />
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl text-deep dark:text-cream mb-1">{item.name}</h3>
                    <p className="text-gold font-serif text-xl">₹{item.price}</p>
                  </div>

                  <div className="flex items-center gap-6 bg-black/5 dark:bg-black/40 border border-gold/20 px-6 py-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item._id || item.name, -1)}
                      className="text-gold-light hover:text-white"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item._id || item.name, 1)}
                      className="text-gold-light hover:text-white"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item._id || item.name)}
                    className="text-deep/25 hover:text-wine dark:text-cream/20 dark:hover:text-wine transition-colors p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <aside className="lg:sticky lg:top-40">
            <div className="glass-panel p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <CreditCard size={120} className="text-gold" />
              </div>

              <h3 className="text-3xl font-light mb-10 pb-4 border-b border-gold/10">Summary</h3>

              <div className="space-y-6 mb-12">
                <div className="flex justify-between text-sm text-deep/55 dark:text-cream/50">
                  <span className="uppercase tracking-widest text-[10px]">Subtotal</span>
                  <span className="font-serif text-lg text-deep dark:text-cream">₹{getCartTotal()}</span>
                </div>
                <div className="flex justify-between text-sm text-deep/55 dark:text-cream/50">
                  <span className="uppercase tracking-widest text-[10px]">Service & GST</span>
                  <span className="italic">Inclusive</span>
                </div>
                <div className="flex justify-between items-end pt-6 border-t border-gold/5">
                  <span className="text-gold uppercase tracking-[0.2em] text-[10px] font-bold">Total Amount</span>
                  <span className="text-5xl font-light text-gold-light">₹{getCartTotal()}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading}
                className="w-full btn-gold py-6 flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Initializing…' : 'Proceed To Payment'} <ArrowRight size={18} />
              </button>

              <div className="mt-8 space-y-3 opacity-50">
                <div className="flex items-center gap-3 text-[9px] uppercase tracking-widest text-deep dark:text-cream">
                  <ShieldCheck size={12} className="text-gold" /> Secure treasury transaction
                </div>
                <div className="flex items-center gap-3 text-[9px] uppercase tracking-widest text-deep dark:text-cream">
                  <Clock size={12} className="text-gold" /> Estimated delivery: 35–45 mins
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
