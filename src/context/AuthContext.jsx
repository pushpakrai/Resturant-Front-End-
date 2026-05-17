import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../lib/api';

// 🔑 Global Axios Interceptor: Auto-attach JWT to every request
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('dq_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

const AuthContext = createContext(null);

export { API };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('dq_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setUser(res.data.user))
        .catch(() => { setToken(null); localStorage.removeItem('dq_token'); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post(`${API}/auth/login`, { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem('dq_token', res.data.token);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await axios.post(`${API}/auth/register`, { name, email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem('dq_token', res.data.token);
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('dq_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
