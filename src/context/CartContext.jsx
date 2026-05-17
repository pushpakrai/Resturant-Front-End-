import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dq_cart') || '[]');
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('dq_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, category) => {
    setCart(prev => {
      const existing = prev.find(c => c.name === item.name);
      if (existing) {
        toast.success(`Added another ${item.name}!`);
        return prev.map(c => c.name === item.name ? { ...c, quantity: c.quantity + 1 } : c);
      }
      toast.success(`${item.name} added to cart! 🛒`);
      return [...prev, { ...item, quantity: 1, category }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(c => (c._id || c.name) !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(c => (c._id || c.name) === id
      ? { ...c, quantity: Math.max(0, c.quantity + delta) }
      : c
    ).filter(c => c.quantity > 0));
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => cart.reduce((s, c) => s + c.price * (c.quantity || 0), 0);
  const total = getCartTotal();
  const count = cart.reduce((s, c) => s + (c.quantity || 0), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, count, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
