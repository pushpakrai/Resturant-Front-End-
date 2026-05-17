/** Fallback when `/api/tenant` is unreachable — swap this file per white-label build if needed. */
export const DEFAULT_TENANT = {
  id: 'default',
  slug: 'diamond-queen',
  brand: {
    name: 'Cafe Diamond Queen',
    tagline: "Pune's Finest",
    established: 'Est. 1950 · Pune',
    heroBadge: "Pune's Crown Jewel of Dining",
    conciergeName: 'Diamond AI',
  },
  contact: {
    addressLines: ['Near Silver Jubilee Petrol Pump', 'Pune 411001, MH'],
    phone: '+91 20 2636 2749',
    email: 'admin@diamondqueen.com',
    helloEmail: 'hello@diamondqueen.com',
  },
  hours: {
    summary: 'Daily 8:00 AM – 11:00 PM',
    brunchNote: 'Weekend brunch 10:00 AM – 3:00 PM',
  },
  story:
    "Pune's legendary culinary destination where Irani tradition meets modern luxury. Every guest is treated as Diamond royalty.",
  payment: {
    businessName: 'Cafe Diamond Queen',
    description: 'Premium culinary experience',
  },
};
