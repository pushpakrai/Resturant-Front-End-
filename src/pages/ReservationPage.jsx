import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTenant } from '../context/TenantContext';
import axios from 'axios';
import { API } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Calendar, Users, Clock, ArrowRight, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';

export default function ReservationPage() {
  const { tenant } = useTenant();
  const [formData, setFormData] = useState({
    date: '', time: '', guests: '2', specialRequests: '', email: '', name: ''
  });
  const [step, setStep] = useState(1); // 1: Details, 2: OTP, 3: Success
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [confirmedCode, setConfirmedCode] = useState('');

  const requestOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${API}/reservations/send-otp`, { email: formData.email });
      setStep(2);
      toast.success("Verification code dispatched to your registry.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Communication lines are momentarily limited.");
    } finally {
      setLoading(false);
    }
  };

  const verifyAndBook = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${API}/reservations/verify-and-book`, { ...formData, otp });
      setConfirmedCode(res.data.reservation.confirmationCode);
      setStep(3);
      toast.success("Table reserved precisely as requested.");
    } catch (err) {
      toast.error("Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-ivory dark:bg-deep flex items-center justify-center p-6 pt-40 text-deep dark:text-cream">
        <motion.div 
          initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
          className="glass-panel max-w-lg w-full p-12 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gold" />
          <CheckCircle2 size={64} className="text-gold mx-auto mb-8" />
          <h2 className="text-4xl font-light mb-4 text-deep dark:text-cream">Reservation Secured</h2>
          <p className="text-deep/55 dark:text-cream/50 text-[10px] tracking-[0.3em] uppercase mb-12">Confirmed for {formData.date} at {formData.time}</p>
          
          <div className="bg-black/5 dark:bg-black/40 border border-gold/20 p-8 mb-12">
            <span className="text-gold text-[10px] tracking-[0.4em] uppercase block mb-2">Confirmation Code</span>
            <span className="text-5xl font-serif text-gold-light tracking-widest">{confirmedCode}</span>
          </div>

          <button onClick={() => window.location.href = '/'} className="btn-gold w-full">Return To {tenant.brand.name.split(' ').pop()}</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory dark:bg-deep pt-48 pb-32 px-6 overflow-hidden relative text-deep dark:text-cream">
      {/* Decorative BG */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-start relative z-10">
        
        <div>
          <p className="text-gold text-[10px] tracking-[0.4em] uppercase mb-4">{tenant.brand.heroBadge}</p>
          <h1 className="text-6xl md:text-8xl font-light mb-10">Dine With <br/><em className="text-gold-light">Distinction</em></h1>
          <p className="text-deep/50 dark:text-cream/40 text-lg font-light leading-relaxed mb-12">
            Secure your presence at {tenant.brand.name}. Every reservation is treated with the utmost priority, ensuring your evening is as flawless as our cuisine.
          </p>
          
          <div className="space-y-8 opacity-40">
             <div className="flex gap-6 items-center">
                <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center"><Calendar size={18} /></div>
                <p className="text-xs tracking-widest uppercase">{tenant.hours.summary}</p>
             </div>
             <div className="flex gap-6 items-center">
                <div className="w-12 h-12 rounded-full border border-gold/30 flex items-center justify-center"><Users size={18} /></div>
                <p className="text-xs tracking-widest uppercase">Large Parties Welcome · Private Dining</p>
             </div>
          </div>
        </div>

        <motion.div initial={{ x: 50, opacity:0 }} animate={{ x:0, opacity:1 }} transition={{ duration: 1 }}>
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form 
                key="step1" onSubmit={requestOtp}
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
                className="glass-panel p-10 space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4 col-span-2">
                    <label className="text-gold text-[10px] tracking-widest uppercase">Full Name</label>
                    <input 
                      type="text" required value={formData.name} placeholder="Your Majesty's Name"
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-black/5 dark:bg-black/40 border border-gold/10 p-4 text-deep dark:text-cream focus:border-gold outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-4 col-span-2">
                    <label className="text-gold text-[10px] tracking-widest uppercase">Email Registry</label>
                    <input 
                      type="email" required value={formData.email} placeholder="for verification"
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-black/5 dark:bg-black/40 border border-gold/10 p-4 text-deep dark:text-cream focus:border-gold outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-gold text-[10px] tracking-widest uppercase">Date</label>
                    <input 
                      type="date" required value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-black/5 dark:bg-black/40 border border-gold/10 p-4 text-deep dark:text-cream focus:border-gold outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-gold text-[10px] tracking-widest uppercase">Time</label>
                    <select 
                      required value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                      className="w-full bg-black/5 dark:bg-black/40 border border-gold/10 p-4 text-deep dark:text-cream focus:border-gold outline-none transition-all"
                    >
                      <option value="" disabled>Select Time</option>
                      {['10:00 AM','12:00 PM','2:00 PM','7:00 PM','8:30 PM','9:00 PM'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-gold text-[10px] tracking-widest uppercase flex items-center gap-2">
                    <Users size={12}/> Party Size
                  </label>
                  <input 
                    type="number" min="1" max="20" required value={formData.guests}
                    onChange={e => setFormData({...formData, guests: e.target.value})}
                    className="w-full bg-black/5 dark:bg-black/40 border border-gold/10 p-4 text-deep dark:text-cream focus:border-gold outline-none transition-all"
                  />
                </div>

                <button 
                  type="submit" disabled={loading}
                  className="w-full btn-gold py-6 flex items-center justify-center gap-4 group disabled:opacity-50"
                >
                  {loading ? "Preparing..." : "Request Access Code"} <ArrowRight size={18} />
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="step2" onSubmit={verifyAndBook}
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-20 }}
                className="glass-panel p-10 space-y-8"
              >
                <div className="text-center mb-6">
                  <ShieldCheck size={32} className="text-gold mx-auto mb-4" />
                  <h3 className="text-2xl font-light mb-2">Identify Yourself</h3>
                  <p className="text-deep/50 dark:text-cream/40 text-[10px] uppercase tracking-widest uppercase">We sent a unique code to {formData.email}</p>
                </div>

                <div className="space-y-4">
                  <label className="text-gold text-[10px] tracking-widest uppercase text-center block">6-Digit Access Code</label>
                  <input 
                    type="text" required value={otp} placeholder="000000" maxLength={6}
                    onChange={e => setOtp(e.target.value)}
                    className="w-full bg-black/5 dark:bg-black/40 border border-gold/20 p-6 text-center text-4xl tracking-widest font-serif text-gold focus:border-gold outline-none transition-all"
                  />
                </div>

                <button 
                  type="submit" disabled={loading || otp.length < 6}
                  className="w-full btn-gold py-6 flex items-center justify-center gap-4 group disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Confirm Presence"} <ArrowRight size={18} />
                </button>

                <button 
                  type="button" onClick={() => setStep(1)}
                  className="w-full text-[10px] uppercase tracking-widest text-deep/40 dark:text-cream/30 hover:text-gold transition-colors"
                >
                  Change Email or Details
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
}
