import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { API } from '../lib/api';
import { DEFAULT_TENANT } from '../config/tenant.defaults';

const TenantContext = createContext(null);

function deepMerge(base, patch) {
  if (!patch || typeof patch !== 'object') return base;
  const out = { ...base };
  for (const k of Object.keys(patch)) {
    const v = patch[k];
    if (v && typeof v === 'object' && !Array.isArray(v) && base[k] && typeof base[k] === 'object') {
      out[k] = deepMerge(base[k], v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

export function TenantProvider({ children }) {
  const [remote, setRemote] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    axios
      .get(`${API}/tenant`)
      .then((r) => {
        if (!cancelled) setRemote(r.data);
      })
      .catch(() => {
        if (!cancelled) setRemote(null);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const tenant = useMemo(() => deepMerge(DEFAULT_TENANT, remote || {}), [remote]);

  const value = useMemo(
    () => ({
      tenant,
      tenantLoading: !ready,
      tenantFromApi: Boolean(remote),
    }),
    [tenant, ready, remote]
  );

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used within TenantProvider');
  return ctx;
}
