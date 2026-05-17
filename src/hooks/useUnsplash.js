import { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../lib/api';

/**
 * Custom hook to fetch a high-res image from Unsplash via our backend proxy.
 * Ensures we don't leak API keys on the frontend and allows tenant-specific queries.
 * @param {string} query - The search term (e.g. 'Handi Biryani')
 * @param {string} fallback - Fallback URL if fetch fails
 */
export function useUnsplash(query, fallback) {
  const [url, setUrl] = useState(fallback);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    let cancelled = false;
    setLoading(true);

    // Call our backend proxy to fetch from Unsplash
    axios
      .get(`${API}/utils/unsplash-proxy?q=${encodeURIComponent(query)}`)
      .then((res) => {
        if (!cancelled && res.data.url) {
          setUrl(res.data.url);
        }
      })
      .catch((err) => {
        console.warn('Unsplash fetch failed, using fallback:', err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  return { url, loading };
}
