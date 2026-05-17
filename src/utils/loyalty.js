const POINTS_KEY = 'dq_diamond_points';
const HISTORY_KEY = 'dq_diamond_history';

export function addDiamondPoints(orderTotalRupees) {
  const n = Math.max(0, Number(orderTotalRupees) || 0);
  const earned = Math.max(1, Math.round(n * 5));
  const prev = parseInt(localStorage.getItem(POINTS_KEY) || '0', 10) || 0;
  localStorage.setItem(POINTS_KEY, String(prev + earned));
  let hist = [];
  try {
    hist = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    hist = [];
  }
  if (!Array.isArray(hist)) hist = [];
  hist.unshift({
    at: Date.now(),
    orderTotal: n,
    points: earned
  });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(hist.slice(0, 25)));
  return { total: prev + earned, earned };
}

export function getDiamondPoints() {
  return parseInt(localStorage.getItem(POINTS_KEY) || '0', 10) || 0;
}

export function getDiamondHistory() {
  try {
    const h = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    return Array.isArray(h) ? h : [];
  } catch {
    return [];
  }
}

export function getRoyalTier(points) {
  if (points >= 5000) return { name: 'Sovereign', next: null };
  if (points >= 2000) return { name: 'Crown', next: 5000 };
  if (points >= 500) return { name: 'Noble', next: 2000 };
  return { name: 'Guest', next: 500 };
}
