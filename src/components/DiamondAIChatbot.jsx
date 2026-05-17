import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API } from '../context/AuthContext';
import { MessageCircle, X, Send, Diamond } from 'lucide-react';

export default function DiamondAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am Diamond AI. Ask me about our menu, hours, or reservations!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const res = await axios.post(`${API}/ai/chat`, { message: userMsg });
      const reply = res.data?.reply?.trim() || "I'm here—could you rephrase that for me?";
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    } catch (err) {
      console.warn('AI Chat Error:', err.message);
      // Fallback message for production grade experience
      const fallback = "I'm currently perfecting our kitchen's secret recipes, so my digital connection is a bit slow. How else may I assist you with the menu or reservations?";
      setMessages(prev => [...prev, { role: 'ai', text: fallback }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute bottom-20 right-0 w-[85vw] sm:w-[350px] h-[450px] bg-black/95 backdrop-blur-xl border border-gold/30 rounded-xl flex flex-col overflow-hidden shadow-2xl z-[1001]"
          >
            {/* Header */}
            <div className="bg-wine/40 p-4 border-b border-gold/20 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <Diamond size={16} className="text-gold-light" />
                <h3 className="font-serif text-lg text-cream m-0 leading-none">Diamond AI</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gold hover:text-gold-light transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 font-sans no-scrollbar">
              {messages.map((m, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`
                    max-w-[80%] p-3 text-sm leading-relaxed
                    ${m.role === 'user' 
                      ? 'self-end bg-gold text-deep rounded-t-xl rounded-bl-xl rounded-br-sm' 
                      : 'self-start bg-white/5 text-cream rounded-t-xl rounded-br-xl rounded-bl-sm border border-white/5'}
                  `}
                >
                  {m.text}
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="self-start bg-white/5 px-4 py-3 rounded-xl rounded-bl-sm border border-gold/10 flex items-center gap-3"
                >
                  <div className="flex gap-1" aria-hidden>
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="text-gold-light"
                        animate={{ opacity: [0.35, 1, 0.35], scale: [0.85, 1.05, 0.85] }}
                        transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.15, ease: 'easeInOut' }}
                      >
                        <Diamond size={14} fill="currentColor" className="opacity-90" />
                      </motion.span>
                    ))}
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-gold/80">Thinking</span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-gold/20 bg-black/40 flex gap-2">
              <input 
                type="text" value={input} onChange={e => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-white/5 border border-gold/20 text-cream px-4 py-2 rounded-full font-sans text-sm focus:outline-none focus:border-gold/60 transition-colors placeholder:text-cream/30"
              />
              <button 
                type="submit" 
                disabled={!input.trim()} 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-gold/20 text-gold disabled:opacity-50 enabled:hover:bg-gold enabled:hover:text-deep enabled:shadow-[0_0_15px_rgba(201,168,76,0.5)]"
              >
                <Send size={16} className="-ml-0.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating diamond concierge */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-16 h-16 rounded-full border border-gold/40 bg-gradient-to-br from-gold-light/90 to-gold shadow-[0_6px_28px_rgba(201,168,76,0.45)] flex items-center justify-center text-deep z-[1002] motion-reduce:transition-none"
        style={{ perspective: '120px' }}
        aria-label={isOpen ? 'Close concierge chat' : 'Open Diamond AI concierge'}
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-gold/25 motion-reduce:animate-none"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        />
        <motion.span
          className="relative flex items-center justify-center motion-reduce:transform-none"
          animate={{ rotateY: [0, 18, -12, 0], rotateX: [0, -6, 4, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {isOpen ? <X size={26} strokeWidth={2} /> : <Diamond size={28} fill="currentColor" className="drop-shadow-md" />}
        </motion.span>
      </motion.button>
    </div>
  );
}
