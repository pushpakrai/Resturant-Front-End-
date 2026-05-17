import { motion } from 'framer-motion';
import { useTenant } from '../context/TenantContext';
import axios from 'axios';
import { useAuth, API } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IndianRupee, Users, TrendingUp, Activity, Coffee, Calendar, ShieldAlert } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { tenant } = useTenant();
  const { user } = useAuth();
  const navigate = useNavigate();

  // 1. Authorization Guard
  const isAuthorized = user && (user.role === 'admin' || user.email === 'admin@diamondqueen.com');

  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const { data } = await axios.get(`${API}/admin/stats`, {
        headers: { Authorization: `Bearer ${user?.token || localStorage.getItem('dq_token')}` }
      });
      return data;
    },
    enabled: !!isAuthorized,
    retry: false,
  });

  const { data: activity, isLoading: activityLoading, error: activityError } = useQuery({
    queryKey: ['adminActivity'],
    queryFn: async () => {
      const { data } = await axios.get(`${API}/admin/recent-activity`, {
        headers: { Authorization: `Bearer ${user?.token || localStorage.getItem('dq_token')}` }
      });
      return data;
    },
    enabled: !!isAuthorized,
    retry: false,
  });

  if (!isAuthorized || statsError?.response?.status === 401 || activityError?.response?.status === 401) {
    return (
      <div className="min-h-screen bg-ivory dark:bg-deep pt-40 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-wine/10 rounded-full flex items-center justify-center mb-8 border border-wine/20">
          <ShieldAlert className="text-wine animate-pulse" size={40} />
        </div>
        <h1 className="text-4xl font-light mb-4 text-deep dark:text-cream">Access Restricted</h1>
        <p className="text-deep/60 dark:text-cream/50 max-w-md mx-auto mb-10 text-sm tracking-wide">
          The Royal Treasury and analytics are reserved for account administrators. Please verify your credentials to proceed.
        </p>
        <button onClick={() => navigate('/login')} className="btn-gold px-12">
          Royal Login
        </button>
      </div>
    );
  }

  if (statsLoading || activityLoading) {
    return (
      <div className="min-h-screen bg-ivory dark:bg-deep flex items-center justify-center">
        <span className="text-gold uppercase tracking-widest text-sm animate-pulse">Initializing Dashboard...</span>
      </div>
    );
  }

  if (!stats || !stats.metrics) {
    return (
      <div className="min-h-screen bg-ivory dark:bg-deep pt-32 pb-20 px-6 flex items-center justify-center font-sans text-deep dark:text-cream">
        <div className="text-center">
          <h2 className="text-3xl font-serif text-gold-light mb-4">No Data Available</h2>
          <p className="text-deep/60 dark:text-cream/60">Could not retrieve operations metrics. Please check connectivity.</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 border border-gold/30 p-4 rounded shadow-xl text-cream">
          <p className="font-serif text-gold-light mb-1">{label}</p>
          <p className="text-sm">Revenue: ₹{payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-ivory dark:bg-deep pt-32 pb-20 px-6 font-sans text-deep dark:text-cream">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-light mb-2">
              <span className="font-serif italic text-gold-light">Operations</span> Center
            </h1>
            <p className="text-deep/50 dark:text-cream/50 uppercase tracking-[0.2em] text-[10px]">
              Managing {tenant.brand.name}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-black/5 dark:bg-black/40 border border-gold/20 px-6 py-3 rounded-full flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest font-bold">System Online</span>
            </div>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { title: 'Gross Revenue', value: `₹${stats.metrics.totalRevenue?.toLocaleString() || 0}`, icon: IndianRupee, change: '+12.5%' },
            { title: 'Today\'s Covers', value: stats.metrics.reservationsToday || 0, icon: Users, change: '+4' },
            { title: 'AI Assist Rate', value: stats.metrics.aiEngagement || '0%', icon: Activity, change: '+5.2%' },
            { title: 'Active Guests', value: stats.metrics.activeUsers || 0, icon: TrendingUp, change: '+18%' },
          ].map((metric, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              key={metric.title} 
              className="glass-panel p-6 relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 opacity-5 text-gold">
                <metric.icon size={100} />
              </div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-deep/60 dark:text-cream/60">{metric.title}</span>
                <span className="text-[10px] text-green-500 font-bold bg-green-500/10 px-2 py-1 rounded">{metric.change}</span>
              </div>
              <div className="text-4xl font-light font-serif text-gold-light">{metric.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Revenue Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="lg:col-span-2 glass-panel p-6"
          >
            <h3 className="text-[10px] uppercase tracking-[0.2em] mb-8 text-gold">7-Day Revenue Trend</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.revenueChart || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.1)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tick={{fill: '#C9A84C', fontSize: 12}} axisLine={false} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={3} dot={{r:4, fill:'#000', stroke:'#C9A84C', strokeWidth:2}} activeDot={{r:6, fill:'#C9A84C'}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Popular Items */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="glass-panel p-6 flex flex-col"
          >
            <h3 className="text-[10px] uppercase tracking-[0.2em] mb-6 text-gold">Bestsellers</h3>
            <div className="flex-1 space-y-6">
              {(stats.popularItems || []).map((item, i) => (
                <div key={item.name} className="flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-black/10 dark:bg-black/40 border border-gold/20 flex items-center justify-center text-gold text-xs">
                      #{i + 1}
                    </div>
                    <div>
                      <p className="text-sm truncate w-[150px] group-hover:text-gold transition-colors">{item.name}</p>
                    </div>
                  </div>
                  <span className="font-serif text-gold-light">{item.count}</span>
                </div>
              ))}
            </div>
            <button className="text-[10px] uppercase tracking-widest text-gold hover:text-white mt-auto pt-4 border-t border-gold/10 transition-colors w-full text-center">
              View Full Menu Analytics
            </button>
          </motion.div>
        </div>

        {/* Activity Feed */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="glass-panel p-6"
        >
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gold/10">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-gold">Live Operations Stream</h3>
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-gold-light"></span>
            </span>
          </div>

          <div className="space-y-6">
            {(activity || []).map((act) => (
              <div key={act.id} className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4 hover:bg-black/10 dark:hover:bg-white/5 p-4 rounded-xl transition-colors border border-transparent hover:border-gold/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-gold/30 flex flex-shrink-0 items-center justify-center bg-black/20 text-gold">
                    {act.type === 'Order' && <Coffee size={20} />}
                    {act.type === 'Reservation' && <Calendar size={20} />}
                    {act.type === 'Payment' && <IndianRupee size={20} />}
                    {act.type === 'AI Chat' && <Activity size={20} />}
                  </div>
                  <div>
                    <p className="text-sm text-deep dark:text-cream">{act.detail}</p>
                    <p className="text-[10px] uppercase tracking-widest text-deep/40 dark:text-cream/30 mt-1">{act.type} · {act.time}</p>
                  </div>
                </div>
                {act.amount && (
                  <div className="font-serif text-lg text-gold-light">
                    +₹{act.amount.toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
