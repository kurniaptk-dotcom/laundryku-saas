/**
 * Membership Tier & Loyalty Helper for LaundryKu
 * Manages tier progression, spend thresholds, discounts, and point multipliers.
 */

export const TIERS = {
  BRONZE: {
    id: 'bronze',
    name: 'Member Bronze',
    minSpend: 0,
    maxSpend: 250000,
    discountPct: 0,
    pointMultiplier: 1.0,
    badge: '🥉 Bronze',
    color: 'from-amber-700 to-amber-900',
    cardBg: 'bg-gradient-to-br from-amber-800/90 via-amber-900 to-stone-900',
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-700/50',
    perks: [
      'Poin standar (1 poin / Rp 1.000)',
      'Akses kupon promo umum',
      'Pelacakan status real-time'
    ]
  },
  SILVER: {
    id: 'silver',
    name: 'Member Silver',
    minSpend: 250000,
    maxSpend: 750000,
    discountPct: 5,
    pointMultiplier: 1.2,
    badge: '🥈 Silver',
    color: 'from-slate-400 to-slate-600',
    cardBg: 'bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900',
    accentColor: 'text-slate-200',
    borderColor: 'border-slate-400/50',
    perks: [
      'Diskon otomatis 5% setiap order',
      'Poin loyalitas 1.2x lipat',
      'Gratis jemput pakaian radius 3 Km',
      'Kupon bulanan eksklusif'
    ]
  },
  GOLD: {
    id: 'gold',
    name: 'VIP Gold',
    minSpend: 750000,
    maxSpend: 2000000,
    discountPct: 10,
    pointMultiplier: 1.5,
    badge: '🥇 VIP Gold',
    color: 'from-amber-400 via-yellow-500 to-amber-600',
    cardBg: 'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-900',
    accentColor: 'text-yellow-200',
    borderColor: 'border-yellow-400/60',
    perks: [
      'Diskon otomatis 10% setiap order',
      'Poin loyalitas 1.5x lipat',
      'Prioritas antrean mesin cuci',
      'Gratis antar-jemput tanpa syarat',
      'Voucher ulang tahun Rp 50.000'
    ]
  },
  PLATINUM: {
    id: 'platinum',
    name: 'Platinum Sultan',
    minSpend: 2000000,
    maxSpend: Infinity,
    discountPct: 15,
    pointMultiplier: 2.0,
    badge: '💎 Platinum Sultan',
    color: 'from-indigo-400 via-purple-500 to-indigo-900',
    cardBg: 'bg-gradient-to-br from-purple-700 via-indigo-800 to-slate-950',
    accentColor: 'text-purple-200',
    borderColor: 'border-purple-400/60',
    perks: [
      'Diskon otomatis 15% setiap order',
      'Poin loyalitas 2x lipat ganda',
      'Layanan Express gratis tanpa biaya tambahan',
      'Gratis 1x Cuci Sepatu per bulan',
      'Jalur prioritas CS khusus WhatsApp'
    ]
  }
};

/**
 * Calculates current tier based on total spending
 */
export const calculateTier = (totalSpent = 0) => {
  const spend = Number(totalSpent) || 0;
  if (spend >= TIERS.PLATINUM.minSpend) return TIERS.PLATINUM;
  if (spend >= TIERS.GOLD.minSpend) return TIERS.GOLD;
  if (spend >= TIERS.SILVER.minSpend) return TIERS.SILVER;
  return TIERS.BRONZE;
};

/**
 * Get tier progression info (progress bar %, next tier name, remaining spend)
 */
export const getTierProgression = (totalSpent = 0) => {
  const spend = Number(totalSpent) || 0;
  const currentTier = calculateTier(spend);

  let nextTier = null;
  let spendNeeded = 0;
  let progressPct = 100;

  if (currentTier.id === 'bronze') {
    nextTier = TIERS.SILVER;
    spendNeeded = Math.max(0, TIERS.SILVER.minSpend - spend);
    progressPct = Math.min(100, Math.round((spend / TIERS.SILVER.minSpend) * 100));
  } else if (currentTier.id === 'silver') {
    nextTier = TIERS.GOLD;
    spendNeeded = Math.max(0, TIERS.GOLD.minSpend - spend);
    const range = TIERS.GOLD.minSpend - TIERS.SIL.minSpend || 500000;
    const currentProgress = spend - TIERS.SILVER.minSpend;
    progressPct = Math.min(100, Math.round((currentProgress / 500000) * 100));
  } else if (currentTier.id === 'gold') {
    nextTier = TIERS.PLATINUM;
    spendNeeded = Math.max(0, TIERS.PLATINUM.minSpend - spend);
    const currentProgress = spend - TIERS.GOLD.minSpend;
    progressPct = Math.min(100, Math.round((currentProgress / 1250000) * 100));
  } else {
    // Max tier reached
    nextTier = null;
    spendNeeded = 0;
    progressPct = 100;
  }

  return {
    currentTier,
    nextTier,
    spendNeeded,
    progressPct: Math.max(5, progressPct),
    totalSpent: spend
  };
};

/**
 * Calculate member tier discount amount
 */
export const calculateTierDiscount = (subtotal = 0, tierIdOrSpent = 'bronze') => {
  let tier;
  if (typeof tierIdOrSpent === 'number') {
    tier = calculateTier(tierIdOrSpent);
  } else {
    const key = (tierIdOrSpent || '').toLowerCase();
    tier = key.includes('plat') ? TIERS.PLATINUM :
           key.includes('gold') || key.includes('vip') ? TIERS.GOLD :
           key.includes('silv') ? TIERS.SILVER : TIERS.BRONZE;
  }

  const discountAmount = Math.round((subtotal * tier.discountPct) / 100);
  return {
    discountPct: tier.discountPct,
    discountAmount,
    tierName: tier.name
  };
};
