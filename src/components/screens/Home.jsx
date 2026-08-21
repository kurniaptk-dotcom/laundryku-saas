import React, { useState, useEffect } from 'react';
import { 
  Bell, Wallet, ChevronRight, Gift, Calendar, Plus, Clock, Sparkles, 
  MapPin, Truck, Star, User, ChevronDown, CheckCircle2, QrCode, Tag, 
  Flame, ShieldCheck, ArrowUpRight, Award, Package, Zap, Monitor
} from 'lucide-react';
import ServiceIcon from '../ServiceIcon';
import { calculateTier, getTierProgression } from '../../utils/tierHelper';
import { isSubscriptionActive, getDaysRemaining } from '../../utils/subscriptionHelper';

export default function Home({ 
  currentCustomer = { id: 'CUST-001', name: 'Aisyah Salsabila', phone: '0812-3456-7890', address: 'Jalan Cempaka Putih Raya No. 42A, Jakarta Pusat', tier: 'Member VIP Premium' },
  customers = [],
  onChangeCustomer,
  walletBalance = 125000, 
  loyaltyPoints = 1250,
  activeOrders = [], 
  orderHistory = [], 
  onNavigate, 
  onTopUpClick,
  onOpenSubscription,
  setSelectedOrderId,
  services = [],
  couriers = [],
  onOpenRewards,
  onOpenNotifs,
  unreadNotifCount = 0,
  onSwitchToAdmin,
  branding = {}
}) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);

  const banners = [
    {
      title: "Cuci Bersih, Hidup Lebih Praktis",
      subtitle: "Diskon 20% untuk Order Pertama Anda",
      cta: "Pesan Sekarang",
      color: "from-sky-500 via-sky-600 to-indigo-600",
      accent: "bg-sky-200/30",
      badge: "✨ Promo Spesial",
      imageType: "washing-machine-isometric"
    },
    {
      title: "Setrika Rapi & Wangi Parfum Premium",
      subtitle: "Bebas kusut, segar tahan hingga 14 hari",
      cta: "Coba Layanan",
      color: "from-blue-600 via-indigo-600 to-purple-600",
      accent: "bg-indigo-200/30",
      badge: "🌸 Wangi Tahan Lama",
      imageType: "iron-isometric"
    },
    {
      title: "Perawatan Sepatu & Sneaker Spesial",
      subtitle: "Bikin sneakers kesayangan kembali seperti baru",
      cta: "Pesan Jasa",
      color: "from-emerald-500 via-teal-600 to-cyan-700",
      accent: "bg-teal-200/30",
      badge: "👟 Deep Cleaning",
      imageType: "shoe-isometric"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [banners.length]);

  const defaultServices = [
    { id: 'cuci_setrika', name: 'Cuci & Setrika', price: 12000, unit: 'Kg', icon: '🧼', color: 'bg-sky-50 border-sky-200/80 text-sky-600 hover:border-sky-400 hover:shadow-sky-100' },
    { id: 'cuci_kering', name: 'Cuci Kering', price: 18000, unit: 'Kg', icon: '👕', color: 'bg-indigo-50 border-indigo-200/80 text-indigo-600 hover:border-indigo-400 hover:shadow-indigo-100' },
    { id: 'setrika_saja', name: 'Setrika Saja', price: 6000, unit: 'Kg', icon: '🔌', color: 'bg-amber-50 border-amber-200/80 text-amber-600 hover:border-amber-400 hover:shadow-amber-100' },
    { id: 'bed_cover', name: 'Bed Cover / Selimut', price: 25000, unit: 'Pc', icon: '🛏️', color: 'bg-rose-50 border-rose-200/80 text-rose-600 hover:border-rose-400 hover:shadow-rose-100' },
    { id: 'sepatu', name: 'Deep Clean Sepatu', price: 20000, unit: 'Pasang', icon: '👟', color: 'bg-teal-50 border-teal-200/80 text-teal-600 hover:border-teal-400 hover:shadow-teal-100' }
  ];

  const serviceCategories = services && services.length > 0 
    ? services.map((s, idx) => ({
        id: s.id,
        name: s.name,
        price: s.price,
        unit: s.unit || 'Kg',
        icon: s.icon || '🧺',
        color: idx % 4 === 0 ? 'bg-sky-50 border-sky-200 text-sky-600 hover:border-sky-400' :
               idx % 4 === 1 ? 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:border-indigo-400' :
               idx % 4 === 2 ? 'bg-amber-50 border-amber-200 text-amber-600 hover:border-amber-400' :
               'bg-rose-50 border-rose-200 text-rose-600 hover:border-rose-400'
      }))
    : defaultServices;

  // Map status values to Indonesian readable status badges and progress percentages
  const getStatusConfig = (status) => {
    switch (status) {
      case 'received':
        return { text: '📥 Pesanan Diterima', stepNumber: 1, pct: 16, bg: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-500', progressColor: 'bg-slate-400' };
      case 'washing':
        return { text: '🧼 Sedang Dicuci', stepNumber: 2, pct: 33, bg: 'bg-sky-50 text-sky-700 border-sky-200 animate-pulse', dot: 'bg-sky-500', progressColor: 'bg-sky-500' };
      case 'drying':
        return { text: '💨 Pengeringan', stepNumber: 3, pct: 50, bg: 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse', dot: 'bg-amber-500', progressColor: 'bg-amber-500' };
      case 'ironing':
        return { text: '🔌 Setrika & Packing', stepNumber: 4, pct: 67, bg: 'bg-indigo-50 text-indigo-750 border-indigo-200 animate-pulse', dot: 'bg-indigo-500', progressColor: 'bg-indigo-500' };
      case 'ready':
        return { text: '🚚 Siap Diantar Kurir', stepNumber: 5, pct: 83, bg: 'bg-teal-50 text-teal-800 border-teal-200 animate-pulse', dot: 'bg-teal-500', progressColor: 'bg-teal-500' };
      case 'Selesai':
      case 'Diambil':
      case 'selesai':
        return { text: '✅ Selesai / Diterima', stepNumber: 6, pct: 100, bg: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-black', dot: 'bg-emerald-600', progressColor: 'bg-emerald-500' };
      default:
        return { text: '🔄 ' + (status || 'Sedang Diproses'), stepNumber: 2, pct: 30, bg: 'bg-sky-50 text-sky-700 border-sky-200', dot: 'bg-sky-500', progressColor: 'bg-sky-400' };
    }
  };

  const isVip = currentCustomer.tier?.includes('VIP');

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto no-scrollbar pb-28">
      {/* 1. Top Header App Bar with Quick Account Switcher */}
      <div className="flex items-center justify-between px-5 sm:px-6 pt-5 pb-4 bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-clay-sm flex-shrink-0">
            {currentCustomer?.name?.slice(0, 2).toUpperCase() || 'AS'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-1">
                <span>Halo, {currentCustomer?.name?.split(' ')[0] || 'Pelanggan'}</span>
                {isVip && <span className="text-xs">👑</span>}
              </h1>
            </div>
            <p className="text-[11px] font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1 truncate max-w-[200px] sm:max-w-[240px]">
              <span>🧼 {branding.laundryName || 'LaundryKu Pro'}</span>
            </p>
          </div>
        </div>
        
        {/* Right Header Badges */}
        <div className="flex items-center gap-2">
          {/* Rewards Points Header Trigger */}
          <button 
            onClick={onOpenRewards}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200/80 rounded-2xl text-xs font-black text-amber-800 transition-all shadow-xs"
          >
            <span>⭐</span>
            <span>{loyaltyPoints.toLocaleString('id-ID')} <span className="hidden sm:inline">Pts</span></span>
          </button>

          {/* Notifications Bell Trigger */}
          <button 
            onClick={onOpenNotifs}
            className="relative p-2.5 sm:p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-2xl transition-colors clay-icon-bg"
            title="Notifikasi"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white ring-2 ring-white animate-pulse">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {/* Direct Switch to Admin Portal Button */}
          {onSwitchToAdmin && (
            <button
              onClick={onSwitchToAdmin}
              className="p-2.5 sm:px-3 sm:py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition-all shadow-clay-sm flex items-center gap-1.5 text-xs font-black"
              title="Buka Portal Admin & Kasir POS"
            >
              <Monitor className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 max-w-4xl mx-auto w-full">
        {/* 2. Hero Interactive Banner Carousel */}
        <div className="relative overflow-hidden rounded-3xl shadow-soft">
          <div 
            className="flex transition-transform duration-700 ease-out" 
            style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
          >
            {banners.map((banner, index) => (
              <div 
                key={index} 
                className={`w-full flex-shrink-0 bg-gradient-to-br ${banner.color} p-5 sm:p-8 text-white flex items-center justify-between relative overflow-hidden`}
                style={{ minHeight: '175px' }}
              >
                <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/10 blur-xl"></div>
                <div className="absolute right-1/3 -top-10 w-32 h-32 rounded-full bg-white/10 blur-lg"></div>

                <div className="z-10 max-w-[65%] sm:max-w-[60%] space-y-2 sm:space-y-2.5">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-amber-300" /> {banner.badge}
                  </span>
                  <h2 className="text-base sm:text-2xl font-black leading-tight tracking-tight">
                    {banner.title}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-sky-100 font-medium leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {banner.subtitle}
                  </p>
                  <button 
                    onClick={() => onNavigate('create_order')}
                    className="mt-1 sm:mt-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-primary hover:bg-sky-50 active:scale-95 font-extrabold text-xs rounded-2xl shadow-soft transition-all inline-flex items-center gap-1.5"
                  >
                    <span>{banner.cta}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </div>

                <div className="absolute right-4 sm:right-6 bottom-3 top-3 w-[30%] sm:w-[28%] flex items-center justify-center z-10">
                  {banner.imageType === 'washing-machine-isometric' && (
                    <div className="relative w-20 h-24 sm:w-24 sm:h-28 bg-white/95 rounded-3xl shadow-clay-lg flex flex-col p-2 border border-sky-100/50 animate-float">
                      <div className="w-full h-3 bg-sky-200/50 rounded-lg mb-1.5 flex justify-between px-1.5 items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-sky-400"></div>
                        <div className="w-4 h-1 bg-sky-400 rounded-sm"></div>
                      </div>
                      <div className="flex-1 rounded-full border-4 border-sky-100 bg-sky-50 flex items-center justify-center relative overflow-hidden">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-sky-200/40 bg-sky-300/30 flex items-center justify-center animate-spin-slow">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-t-2 border-primary flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {banner.imageType === 'iron-isometric' && (
                    <div className="relative w-24 h-18 sm:w-28 sm:h-20 bg-white/95 rounded-3xl shadow-clay-lg flex flex-col items-center justify-center border border-sky-100/50 animate-float">
                      <div className="w-16 h-3 bg-indigo-500 rounded-full absolute -top-1 flex items-center justify-center">
                        <div className="w-3 h-1 bg-white/40 rounded-full"></div>
                      </div>
                      <div className="w-16 h-10 border-b-6 border-indigo-500/80 rounded-b-xl mt-1 relative">
                        <div className="absolute right-2 top-1 w-2 h-2 bg-indigo-400 rounded-full animate-ping"></div>
                      </div>
                      <span className="text-xl">💨</span>
                    </div>
                  )}
                  {banner.imageType === 'shoe-isometric' && (
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-white/95 rounded-3xl shadow-clay-lg flex items-center justify-center border border-teal-100/50 animate-float">
                      <div className="relative text-3xl sm:text-4xl">
                        👟
                        <span className="absolute -top-1 -right-1 text-base animate-ping">✨</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Pagination Dots */}
          <div className="absolute bottom-3 left-5 sm:left-8 flex gap-1.5 z-20">
            {banners.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCarouselIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${carouselIndex === idx ? 'w-6 bg-white shadow-sm' : 'w-2 bg-white/40'}`}
              ></button>
            ))}
          </div>
        </div>

        {/* 3. Dual-Tone Quick Wallet & Rewards Card */}
        {(() => {
          const tierInfo = getTierProgression(currentCustomer?.totalSpent || 0);
          return (
            <div className="bg-white rounded-3xl border border-slate-150/80 shadow-soft p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2.5xl bg-gradient-to-tr from-sky-400 to-primary text-white flex items-center justify-center shadow-clay-sm flex-shrink-0">
                    <Wallet className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Laundry Wallet · {currentCustomer.name.split(' ')[0]}
                      </p>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-slate-900 text-amber-300 border border-slate-700 shadow-xs">
                        {tierInfo.currentTier.badge}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-2xl font-black text-slate-850">
                        Rp {walletBalance.toLocaleString('id-ID')}
                      </h3>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        Aktif
                      </span>
                    </div>
                  </div>
                </div>

                {/* Wallet Action Buttons */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={onTopUpClick}
                    className="flex-1 sm:flex-none px-5 py-3 text-white font-black text-xs bg-primary hover:bg-primary-dark rounded-2xl transition-all shadow-clay-sm clay-button text-center"
                  >
                    + Top Up Saldo
                  </button>
                  <button 
                    onClick={onOpenRewards}
                    className="px-3.5 py-3 text-amber-800 font-bold text-xs bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-2xl transition-all flex items-center gap-1.5"
                  >
                    <Gift className="w-4 h-4 text-amber-600" />
                    <span className="font-black text-xs">{loyaltyPoints} Poin</span>
                  </button>
                </div>
              </div>

              {/* Member Tier Progression Bar */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5 font-black text-slate-800">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Level {tierInfo.currentTier.badge}</span>
                    {tierInfo.currentTier.discountPct > 0 && (
                      <span className="px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded-md text-[10px] font-black">
                        Diskon {tierInfo.currentTier.discountPct}%
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">
                    {tierInfo.nextTier 
                      ? `+Rp ${tierInfo.spendNeeded.toLocaleString('id-ID')} menuju ${tierInfo.nextTier.badge}`
                      : '⭐ Level Maksimal Tercapai'}
                  </span>
                </div>

                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 via-primary to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${tierInfo.progressPct}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* 3.5. Subscription Kuota Kiloan Card */}
        {(() => {
          const hasSub = isSubscriptionActive(currentCustomer?.subscription);
          const sub = currentCustomer?.subscription;
          const daysLeft = hasSub ? getDaysRemaining(sub?.validUntil) : 0;
          const quotaPct = hasSub && sub?.totalKg ? Math.round((sub.remainingKg / sub.totalKg) * 100) : 0;

          if (hasSub) {
            return (
              <div className="bg-gradient-to-br from-indigo-900 via-[#132347] to-slate-950 p-5 sm:p-6 rounded-3xl text-white shadow-soft relative overflow-hidden border border-indigo-500/30 space-y-3.5">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300">Paket Langganan Aktif</span>
                      <h4 className="text-sm font-black">{sub.planName}</h4>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[10px] font-black">
                    ● Aktif ({daysLeft} Hari Lagi)
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Sisa Kuota Kiloan:</span>
                    <span className="text-white font-black text-sm">{sub.remainingKg} / {sub.totalKg} Kg</span>
                  </div>
                  <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/10">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-500"
                      style={{ width: `${quotaPct}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-white/10 text-xs">
                  <span className="text-[11px] text-slate-400">Hemat ~Rp 6.000/Kg per order</span>
                  <button
                    onClick={onOpenSubscription}
                    className="text-xs font-black text-indigo-300 hover:text-white flex items-center gap-1"
                  >
                    <span>Kelola / Tambah Kuota →</span>
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div 
              onClick={onOpenSubscription}
              className="bg-gradient-to-r from-indigo-500 via-primary to-sky-500 p-4 sm:p-5 rounded-3xl text-white shadow-soft flex items-center justify-between cursor-pointer hover:opacity-95 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-xs">
                  🧺
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black">Paket Cuci Kiloan Bulanan</h4>
                  <p className="text-[11px] text-sky-100 font-semibold">Mulai Rp 5.000/Kg · Hemat hingga 50%</p>
                </div>
              </div>
              <span className="px-3 py-1.5 bg-white text-primary font-black text-xs rounded-xl shadow-sm group-hover:scale-105 transition-transform flex items-center gap-1">
                <span>Pilih Paket</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          );
        })()}

        {/* 4. Services Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-850">Katalog Layanan</h3>
              <p className="text-xs text-slate-400 font-semibold">Pilih jenis layanan cucian profesional Anda</p>
            </div>
            <button 
              onClick={() => onNavigate('create_order')}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5"
            >
              Order <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-5 gap-2 sm:gap-3.5 pt-1">
            {serviceCategories.map((service) => (
              <button
                key={service.id}
                onClick={() => onNavigate('create_order')}
                className="flex flex-col items-center group p-1.5 sm:p-2 rounded-2.5xl hover:bg-white transition-all text-center focus:outline-none"
              >
                <div className="mb-2">
                  <ServiceIcon
                    serviceId={service.id}
                    name={service.name}
                    fallbackIcon={service.icon}
                    size="md"
                  />
                </div>
                <span className="text-[10px] sm:text-xs font-extrabold text-slate-800 group-hover:text-primary tracking-tight leading-tight line-clamp-2 transition-colors">
                  {service.name}
                </span>
                <span className="text-[9px] font-bold text-slate-400 group-hover:text-primary/80 mt-0.5 hidden sm:inline transition-colors">
                  Rp {(service.price || 12000).toLocaleString('id-ID')}/{service.unit}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 5. Live Active Orders Section (Filtered strictly for current customer) */}
        {activeOrders.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
                <h3 className="text-base font-extrabold text-slate-850">Pesanan Sedang Berjalan</h3>
              </div>
              <span className="text-xs font-black text-primary bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                {activeOrders.length} Cucian Aktif
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeOrders.map((order) => {
                const config = getStatusConfig(order.status);
                return (
                  <div 
                    key={order.id}
                    onClick={() => {
                      setSelectedOrderId(order.id);
                      onNavigate('order_detail');
                    }}
                    className="relative p-5 bg-white rounded-3xl border-2 border-sky-100/90 shadow-soft cursor-pointer hover:border-primary hover:shadow-soft-lg transition-all group overflow-hidden space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1.5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black rounded-full border ${config.bg}`}>
                          <span className={`w-2 h-2 rounded-full ${config.dot}`}></span>
                          {config.text}
                        </span>
                        <h4 className="text-base font-black text-slate-850 mt-1">{order.id}</h4>
                        
                        <div className="space-y-0.5 text-xs text-slate-600 font-semibold">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">🧺</span>
                            <span>{order.serviceName} · {order.amount} {order.unit}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>Estimasi Selesai: <strong className="text-slate-700">{order.eta}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Animated Machine Visual Indicator */}
                      <div className="relative w-16 h-18 bg-sky-50 rounded-2xl border border-sky-100 shadow-clay-sm p-1.5 flex flex-col items-center flex-shrink-0">
                        <div className="w-full h-1.5 bg-slate-200 rounded-sm mb-1 flex justify-between px-0.5 items-center">
                          <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                          <div className="w-2 h-0.5 bg-slate-400 rounded-sm"></div>
                        </div>
                        <div className="flex-1 w-full rounded-full bg-white border border-sky-100 flex items-center justify-center relative overflow-hidden">
                          <div className="w-8 h-8 rounded-full border border-sky-200 flex items-center justify-center animate-spin-slow">
                            <div className="w-5 h-5 rounded-full border-t-2 border-primary"></div>
                          </div>
                          {order.status === 'washing' && (
                            <div className="absolute inset-0 bg-primary/20 animate-pulse"></div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar (Tahap 1-6) */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400">
                        <span>Tahap {config.stepNumber} dari 6</span>
                        <span className="font-black text-primary">{config.pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${config.progressColor} rounded-full transition-all duration-500`}
                          style={{ width: `${config.pct}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Courier Indicator Badge */}
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-2 truncate">
                        <Truck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="truncate">{order.courierName || 'Doni Pratama (Honda Vario)'}</span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        Siap
                      </span>
                    </div>
                    
                    {/* Action Link */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-black text-primary group-hover:translate-x-0.5 transition-transform">
                      <span>Pantau Rincian Pelacakan</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 6. Special Promo Banner */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 rounded-3xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between relative overflow-hidden shadow-soft gap-4">
          <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
          <div className="z-10 space-y-1 max-w-lg">
            <span className="inline-block px-2.5 py-0.5 bg-white/20 text-[10px] font-black rounded-lg uppercase tracking-wider">
              Kupon Bebas Ongkir
            </span>
            <h4 className="text-base sm:text-lg font-black leading-snug">Antar Jemput Gratis Tanpa Minimum Order</h4>
            <p className="text-xs text-sky-100 font-medium">Gunakan kode kupon <strong className="font-mono bg-white/20 px-2 py-0.5 rounded text-white">FREEONGKIR</strong> sekarang.</p>
          </div>
          <button 
            onClick={() => onNavigate('promos')}
            className="z-10 px-5 py-2.5 bg-white text-primary font-black text-xs rounded-2xl shadow-soft hover:bg-sky-50 active:scale-95 transition-all self-stretch sm:self-auto text-center"
          >
            Lihat Kupon
          </button>
        </div>
      </div>
    </div>
  );
}
