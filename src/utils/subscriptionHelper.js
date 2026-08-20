/**
 * Subscription & Kiloan Quota Helper for LaundryKu
 * Handles monthly kg packages, validity tracking, and quota deductions.
 */

export const SUBSCRIPTION_PLANS = [
  {
    id: 'plan_kost',
    name: 'Paket Anak Kost Hemat',
    tag: 'Paling Populer',
    quotaKg: 25,
    validityDays: 30,
    price: 150000, // Rp 6.000 / Kg (Normal: Rp 12.000 / Kg - Hemat 50%!)
    pricePerKg: 6000,
    normalPricePerKg: 12000,
    badgeColor: 'bg-sky-50 text-primary border-sky-200',
    accentColor: 'from-sky-500 to-indigo-600',
    features: [
      'Kuota 25 Kg Cuci & Setrika Reguler',
      'Masa berlaku 30 Hari kalender',
      'Bebas pisah hingga 5x penjemputan',
      'Pewangi premium bebas pilih'
    ]
  },
  {
    id: 'plan_family',
    name: 'Paket Keluarga Ceria',
    tag: 'Hemat Maksimal',
    quotaKg: 60,
    validityDays: 45,
    price: 330000, // Rp 5.500 / Kg
    pricePerKg: 5500,
    normalPricePerKg: 12000,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    accentColor: 'from-emerald-500 to-teal-700',
    features: [
      'Kuota 60 Kg Cuci & Setrika Bebas Campur',
      'Masa berlaku 45 Hari kalender',
      'Gratis Antar-Jemput radius 5 Km',
      'Prioritas antrean mesin cuci'
    ]
  },
  {
    id: 'plan_sultan',
    name: 'Paket Sultan Unlimited Care',
    tag: 'VIP Eksklusif',
    quotaKg: 100,
    validityDays: 60,
    price: 500000, // Rp 5.000 / Kg
    pricePerKg: 5000,
    normalPricePerKg: 12000,
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    accentColor: 'from-purple-600 via-indigo-600 to-slate-900',
    features: [
      'Kuota 100 Kg Cuci & Setrika + Bed Cover',
      'Masa berlaku 60 Hari kalender',
      'Gratis 1x Deep Clean Sepatu',
      'Layanan Express Prioritas tanpa biaya tambahan',
      'Gratis Antar-Jemput tanpa batas radius'
    ]
  }
];

export const isSubscriptionActive = (sub) => {
  if (!sub || !sub.active || sub.remainingKg <= 0) return false;
  if (!sub.validUntil) return true;
  const expiry = new Date(sub.validUntil);
  return expiry.getTime() >= Date.now();
};

export const getDaysRemaining = (validUntil) => {
  if (!validUntil) return 0;
  const expiry = new Date(validUntil);
  const diff = expiry.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

export const createSubscriptionInstance = (planId) => {
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId) || SUBSCRIPTION_PLANS[0];
  const now = new Date();
  const validUntilDate = new Date(now.getTime() + plan.validityDays * 24 * 60 * 60 * 1000);
  
  return {
    planId: plan.id,
    planName: plan.name,
    totalKg: plan.quotaKg,
    remainingKg: plan.quotaKg,
    startDate: now.toISOString(),
    validUntil: validUntilDate.toISOString(),
    validUntilFormatted: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(validUntilDate),
    active: true
  };
};
