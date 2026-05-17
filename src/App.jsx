import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import { AuthProvider } from './context/AuthContext';
import { TenantProvider } from './context/TenantContext';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
    },
  },
});

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DiamondAIChatbot from './components/DiamondAIChatbot';
import PageWrapper from './components/PageWrapper';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MenuPage from './pages/MenuPage';
import ReservationPage from './pages/ReservationPage';
import CartPage from './pages/CartPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import RoyaltyPage from './pages/RoyaltyPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><RegisterPage /></PageWrapper>} />
        <Route path="/menu" element={<PageWrapper><MenuPage /></PageWrapper>} />
        <Route path="/order-success" element={<PageWrapper><OrderSuccessPage /></PageWrapper>} />
        <Route path="/royalty" element={<PageWrapper><RoyaltyPage /></PageWrapper>} />
        <Route path="/admin" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
        <Route path="/cart" element={
          <ProtectedRoute><PageWrapper><CartPage /></PageWrapper></ProtectedRoute>
        } />
        <Route path="/reservation" element={
          <ProtectedRoute><PageWrapper><ReservationPage /></PageWrapper></ProtectedRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TenantProvider>
          <AuthProvider>
            <CartProvider>
              <BrowserRouter>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    style: {
                      background: '#1A0A00',
                      color: '#DFBF66',
                      border: '1px solid rgba(201,168,76,0.3)',
                      fontFamily: "'Outfit', sans-serif",
                    },
                    success: { iconTheme: { primary: '#C9A84C', secondary: '#1A0A00' } },
                    error: { iconTheme: { primary: '#6B1F2A', secondary: '#FAF5EE' } },
                  }}
                />
                <Navbar />
                <AnimatedRoutes />
                <Footer />
                <DiamondAIChatbot />
              </BrowserRouter>
            </CartProvider>
          </AuthProvider>
        </TenantProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
