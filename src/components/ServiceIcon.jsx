import React from 'react';

/**
 * High-fidelity 3D Vector Illustrations for Laundry Elements
 * Matches the original playful claymorphic laundry theme.
 */

// 1. Sabun Mandi Berbusa 3D (Cuci & Setrika)
const SoapIllustration = () => (
  <svg viewBox="0 0 64 64" className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-sm transition-transform group-hover:scale-110 duration-300">
    <defs>
      <linearGradient id="soapBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f472b6" />
        <stop offset="50%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#db2777" />
      </linearGradient>
      <linearGradient id="soapTop" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fbcfe8" />
        <stop offset="100%" stopColor="#f472b6" />
      </linearGradient>
      <linearGradient id="bubbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="50%" stopColor="#bae6fd" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
      </linearGradient>
    </defs>

    {/* Soap Shadow */}
    <ellipse cx="32" cy="46" rx="20" ry="6" fill="#0284c7" opacity="0.12" />

    {/* 3D Soap Bar */}
    <g transform="rotate(-10 32 34)">
      {/* Base thickness */}
      <rect x="15" y="24" width="34" height="20" rx="9" fill="#be185d" />
      {/* Main body */}
      <rect x="15" y="21" width="34" height="20" rx="9" fill="url(#soapBody)" />
      {/* Top highlight cap */}
      <ellipse cx="32" cy="27" rx="13" ry="5" fill="url(#soapTop)" opacity="0.85" />
      {/* Engraved wavy emblem */}
      <path d="M 24 27 Q 28 25 32 27 T 40 27" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.6" />
    </g>

    {/* Translucent Bubbles */}
    <circle cx="17" cy="22" r="6.5" fill="url(#bubbleGrad)" stroke="#e0f2fe" strokeWidth="0.75" />
    <circle cx="15" cy="20" r="2" fill="#ffffff" opacity="0.9" />

    <circle cx="46" cy="23" r="5" fill="url(#bubbleGrad)" stroke="#e0f2fe" strokeWidth="0.75" />
    <circle cx="44.5" cy="21.5" r="1.5" fill="#ffffff" opacity="0.9" />

    <circle cx="21" cy="42" r="4.5" fill="url(#bubbleGrad)" stroke="#e0f2fe" strokeWidth="0.75" />
    <circle cx="48" cy="38" r="3.5" fill="url(#bubbleGrad)" stroke="#e0f2fe" strokeWidth="0.75" />

    {/* Sparkle */}
    <path d="M 12 13 L 13.5 16.5 L 17 18 L 13.5 19.5 L 12 23 L 10.5 19.5 L 7 18 L 10.5 16.5 Z" fill="#facc15" />
  </svg>
);

// 2. Kaos Hijau-Putih Bersih 3D (Cuci Kering)
const ShirtIllustration = () => (
  <svg viewBox="0 0 64 64" className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-sm transition-transform group-hover:scale-110 duration-300">
    <defs>
      <linearGradient id="shirtGreen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4ade80" />
        <stop offset="50%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#16a34a" />
      </linearGradient>
      <linearGradient id="shirtStripe" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="100%" stopColor="#fde047" />
      </linearGradient>
    </defs>

    {/* Drop shadow */}
    <ellipse cx="32" cy="52" rx="18" ry="4.5" fill="#166534" opacity="0.15" />

    {/* Shirt Body & Sleeves */}
    <path d="M 23 15 L 13 23 L 18 29 L 22 26 L 22 47 Q 22 49 24 49 L 40 49 Q 42 49 42 47 L 42 26 L 46 29 L 51 23 L 41 15 Z" fill="url(#shirtGreen)" />

    {/* Sleeve Cuffs */}
    <polygon points="13,23 18,29 16.5,30.5 11.5,24.5" fill="#86efac" />
    <polygon points="51,23 46,29 47.5,30.5 52.5,24.5" fill="#86efac" />

    {/* Horizontal Cream/Yellow Accent Stripe */}
    <path d="M 22 28 L 42 28 L 42 34 L 22 34 Z" fill="url(#shirtStripe)" />

    {/* Collar */}
    <path d="M 27 15 Q 32 21 37 15 Q 35 14 32 14 Q 29 14 27 15 Z" fill="#ffffff" />
    <path d="M 28 15 Q 32 19 36 15" stroke="#15803d" strokeWidth="1.2" fill="none" />

    {/* Bottom Hem Accent */}
    <rect x="22" y="46" width="20" height="3" rx="1.5" fill="#15803d" opacity="0.4" />

    {/* Sparkle */}
    <path d="M 47 12 L 48.5 15 L 51.5 16.5 L 48.5 18 L 47 21 L 45.5 18 L 42.5 16.5 L 45.5 15 Z" fill="#38bdf8" />
  </svg>
);

// 3. Setrika Uap Pakaian 3D (Setrika Saja)
const SteamIronIllustration = () => (
  <svg viewBox="0 0 64 64" className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-sm transition-transform group-hover:scale-110 duration-300">
    <defs>
      <linearGradient id="ironBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="45%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      <linearGradient id="ironHandle" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="50%" stopColor="#1e293b" />
        <stop offset="100%" stopColor="#0f172a" />
      </linearGradient>
      <linearGradient id="soleplate" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="50%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>
      <linearGradient id="waterTank" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.5" />
      </linearGradient>
    </defs>

    {/* Shadow */}
    <ellipse cx="32" cy="52" rx="20" ry="4.5" fill="#d97706" opacity="0.18" />

    {/* Metallic Soleplate Base (Bottom Plate) */}
    <path d="M 12 43 C 12 43 14 46 20 46 L 47 46 C 49 46 51 44.5 51 43 L 49 40 L 16 40 Z" fill="url(#soleplate)" stroke="#cbd5e1" strokeWidth="0.75" />

    {/* Main Steam Iron Body (Aerodynamic pointed shape) */}
    <path d="M 15 40 C 14 36 21 26 27 24 L 46 24 C 48 24 50 26 50 30 L 49 40 Z" fill="url(#ironBody)" />

    {/* Water Window / Tank on Iron Body */}
    <path d="M 26 31 C 24 33 22 36 21 38 L 43 38 C 45 36 45 33 44 31 Z" fill="url(#waterTank)" stroke="#ffffff" strokeWidth="0.5" />

    {/* Temperature Dial Knob */}
    <circle cx="34" cy="34" r="3.5" fill="#1e293b" />
    <circle cx="34" cy="34" r="1.5" fill="#f59e0b" />

    {/* Ergonomic Curved Handle */}
    <path d="M 27 24 C 27 15 32 14 38 14 L 44 14 C 49 14 51 18 51 24 L 50 27 L 45 27 C 45 20 44 18 41 18 L 36 18 C 32 18 31 20 31 24 Z" fill="url(#ironHandle)" />

    {/* Steam Spray Buttons on Top */}
    <rect x="28" y="12.5" width="4.5" height="3" rx="1.5" fill="#f59e0b" />
    <rect x="34" y="12.5" width="4.5" height="3" rx="1.5" fill="#38bdf8" />

    {/* Steam Puffs / Heat Waves (Uap Wangi Halus di Depan) */}
    <path d="M 11 44 C 8 45 7 48 9 50" stroke="#38bdf8" strokeWidth="1.75" strokeLinecap="round" fill="none" opacity="0.8" />
    <path d="M 8 41 C 5 42 4 45 6 47" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6" />
    <circle cx="10" cy="48" r="1" fill="#38bdf8" opacity="0.7" />

    {/* Sparkle */}
    <path d="M 48 10 L 49.5 13 L 52.5 14.5 L 49.5 16 L 48 19 L 46.5 16 L 43.5 14.5 L 46.5 13 Z" fill="#f59e0b" />
  </svg>
);

// 4. Tempat Tidur & Bed Cover 3D (Bed Cover / Selimut)
const BedCoverIllustration = () => (
  <svg viewBox="0 0 64 64" className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-sm transition-transform group-hover:scale-110 duration-300">
    <defs>
      <linearGradient id="bedFrame" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#312e81" />
        <stop offset="100%" stopColor="#1e1b4b" />
      </linearGradient>
      <linearGradient id="quiltBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="50%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
      <linearGradient id="pillow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#bfdbfe" />
      </linearGradient>
    </defs>

    {/* Shadow */}
    <ellipse cx="32" cy="52" rx="22" ry="5" fill="#be123c" opacity="0.12" />

    {/* Bed Headboard (Dark Indigo) */}
    <rect x="12" y="16" width="40" height="22" rx="4" fill="url(#bedFrame)" />
    {/* Headboard tufting lines */}
    <line x1="25" y1="18" x2="25" y2="34" stroke="#4338ca" strokeWidth="1.5" />
    <line x1="39" y1="18" x2="39" y2="34" stroke="#4338ca" strokeWidth="1.5" />

    {/* Pillows (Two Soft White/Cyan Pillows) */}
    <rect x="16" y="24" width="14" height="9" rx="3.5" fill="url(#pillow)" stroke="#93c5fd" strokeWidth="0.75" />
    <rect x="34" y="24" width="14" height="9" rx="3.5" fill="url(#pillow)" stroke="#93c5fd" strokeWidth="0.75" />

    {/* Mattress Base */}
    <rect x="11" y="32" width="42" height="16" rx="4" fill="#e0e7ff" />

    {/* Thick Fluffy Bed Cover Quilt (Blue with soft fold) */}
    <path d="M 11 36 Q 32 33 53 36 L 53 46 Q 53 48 51 48 L 13 48 Q 11 48 11 46 Z" fill="url(#quiltBody)" />
    {/* Foldover Sheet Accent */}
    <path d="M 11 36 Q 32 33 53 36 L 53 39 Q 32 36 11 39 Z" fill="#60a5fa" />

    {/* Bed Legs */}
    <rect x="13" y="47" width="4" height="5" rx="1.5" fill="#1e1b4b" />
    <rect x="47" y="47" width="4" height="5" rx="1.5" fill="#1e1b4b" />

    {/* Sparkle */}
    <path d="M 48 12 L 49.5 15 L 52.5 16.5 L 49.5 18 L 48 21 L 46.5 18 L 43.5 16.5 L 46.5 15 Z" fill="#f43f5e" />
  </svg>
);

// 5. Sepatu Sneakers 3D (Deep Clean Sepatu)
const SneakerIllustration = () => (
  <svg viewBox="0 0 64 64" className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-sm transition-transform group-hover:scale-110 duration-300">
    <defs>
      <linearGradient id="shoeUpper" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c084fc" />
        <stop offset="50%" stopColor="#a855f7" />
        <stop offset="100%" stopColor="#7e22ce" />
      </linearGradient>
      <linearGradient id="shoeSole" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#e2e8f0" />
      </linearGradient>
    </defs>

    {/* Shadow */}
    <ellipse cx="33" cy="52" rx="20" ry="4.5" fill="#0f766e" opacity="0.15" />

    {/* Slanted Sneaker Body (Facing Left) */}
    <g transform="rotate(-12 32 34)">
      {/* White Rubber Sole */}
      <path d="M 12 40 C 18 40 44 40 49 39 C 52 38.5 53 43 51 45 C 47 47 16 47 12 44 C 10 42.5 10 40 12 40 Z" fill="url(#shoeSole)" stroke="#cbd5e1" strokeWidth="0.75" />

      {/* Sneaker Upper Body (Purple) */}
      <path d="M 14 40 C 18 36 24 33 29 27 C 32 23 37 20 42 22 C 45 23 48 27 49 34 C 49 39 48 39 44 39 C 38 39 16 40 14 40 Z" fill="url(#shoeUpper)" />

      {/* Heel Cushion Collar */}
      <ellipse cx="43" cy="23" rx="5" ry="3" fill="#f3e8ff" />

      {/* White Toe Cap */}
      <path d="M 13 40 C 15 37 19 36 21 38 C 18 41 15 41 13 40 Z" fill="#ffffff" opacity="0.9" />

      {/* Laces (White diagonal dashes) */}
      <line x1="27" y1="30" x2="31" y2="28" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="33" x2="34" y2="31" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <line x1="33" y1="36" x2="37" y2="34" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

      {/* Sporty swoosh line */}
      <path d="M 23 38 Q 32 37 42 31" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.85" />
    </g>

    {/* Sparkle Clean Shines */}
    <path d="M 13 18 L 14.5 21.5 L 18 23 L 14.5 24.5 L 13 28 L 11.5 24.5 L 8 23 L 11.5 21.5 Z" fill="#2dd4bf" />
    <circle cx="50" cy="20" r="1.5" fill="#ffffff" />
  </svg>
);

export const getServiceTheme = (serviceId = '', name = '') => {
  const id = (serviceId || '').toLowerCase();
  const n = (name || '').toLowerCase();

  if (id.includes('cuci_setrika') || n.includes('cuci & setrika') || n.includes('komplit') || n.includes('setrika rapi')) {
    return {
      type: 'cuci_setrika',
      bgCard: 'bg-sky-50/90 border border-sky-200/80 hover:bg-sky-100/90 hover:border-sky-300 hover:shadow-sky-200/50',
      illustration: <SoapIllustration />
    };
  }

  if (id.includes('cuci_kering') || n.includes('cuci kering') || n.includes('dry clean')) {
    return {
      type: 'cuci_kering',
      bgCard: 'bg-indigo-50/90 border border-indigo-200/80 hover:bg-indigo-100/90 hover:border-indigo-300 hover:shadow-indigo-200/50',
      illustration: <ShirtIllustration />
    };
  }

  if (id.includes('setrika') || n.includes('setrika')) {
    return {
      type: 'setrika_saja',
      bgCard: 'bg-amber-50/90 border border-amber-200/80 hover:bg-amber-100/90 hover:border-amber-300 hover:shadow-amber-200/50',
      illustration: <SteamIronIllustration />
    };
  }

  if (id.includes('bed_cover') || id.includes('selimut') || n.includes('bed cover') || n.includes('selimut') || n.includes('sprei')) {
    return {
      type: 'bed_cover',
      bgCard: 'bg-rose-50/90 border border-rose-200/80 hover:bg-rose-100/90 hover:border-rose-300 hover:shadow-rose-200/50',
      illustration: <BedCoverIllustration />
    };
  }

  if (id.includes('sepatu') || n.includes('sepatu') || n.includes('sneaker') || n.includes('shoes')) {
    return {
      type: 'sepatu',
      bgCard: 'bg-teal-50/90 border border-teal-200/80 hover:bg-teal-100/90 hover:border-teal-300 hover:shadow-teal-200/50',
      illustration: <SneakerIllustration />
    };
  }

  // Fallback for custom CMS services
  return {
    type: 'custom',
    bgCard: 'bg-slate-50 border border-slate-200/80 hover:bg-slate-100',
    illustration: null
  };
};

export default function ServiceIcon({ 
  serviceId = '', 
  name = '', 
  fallbackIcon = '🧺',
  size = 'md', // 'sm', 'md', 'lg'
  className = ''
}) {
  const theme = getServiceTheme(serviceId, name);

  const sizeClasses = {
    sm: 'w-11 h-11 rounded-xl',
    md: 'w-13 h-13 sm:w-16 sm:h-16 rounded-2.5xl',
    lg: 'w-18 h-18 sm:w-20 sm:h-20 rounded-3xl'
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]} ${theme.bgCard} shadow-clay-sm transition-all duration-300 group-hover:scale-105 group-active:scale-95 ${className}`}>
      {theme.illustration ? (
        theme.illustration
      ) : (
        <span className="text-2xl sm:text-3xl drop-shadow-sm">
          {fallbackIcon || '🧺'}
        </span>
      )}
    </div>
  );
}
