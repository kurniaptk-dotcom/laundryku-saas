import React, { useState } from 'react';
import { 
  Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, Sparkles, 
  Crown, Monitor, Truck, ShieldAlert, ChevronLeft, Building2, User
} from 'lucide-react';
import { DEFAULT_TENANTS } from '../utils/saasHelper';

export default function DedicatedRoleLoginPage({ 
  roleKey = 'owner_mobile', 
  tenants = DEFAULT_TENANTS, 
  onLoginSuccess, 
  onBackToLanding,
  isDark = false 
}) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roleThemes = {
    super_admin: {
      title: 'Portal Super Admin Master',
      subtitle: 'Pusat kendali master platform SaaS LaundryKu Pro. Masukkan kredensial administrator.',
      badge: 'MASTER SAAS CONTROL',
      badgeColor: 'bg-slate-800 text-amber-300 border-slate-700',
      icon: '⚙️',
      themeBg: 'from-slate-950 via-slate-900 to-indigo-950 text-white',
      cardBg: 'bg-slate-900/90 border-slate-800 text-white backdrop-blur-xl',
      inputBg: 'bg-slate-950 border-slate-800 text-white placeholder-slate-500',
      buttonGradient: 'from-amber-500 via-orange-500 to-rose-600 shadow-amber-500/20',
      labelIdentifier: 'ID Master / Email Super Admin:',
      placeholderIdentifier: 'admin@laundryku.id atau 081234567890',
      defaultHint: 'ID Demo: admin@laundryku.id | PIN: 1234'
    },
    owner_mobile: {
      title: 'Portal Pemilik Laundry (Owner)',
      subtitle: 'Pantau omzet harian, laporan laba rugi, dan kelola IoT mesin cuci gerai Anda.',
      badge: 'SMARTOWNER ERP PORTAL',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
      icon: '👑',
      themeBg: 'from-slate-950 via-indigo-950 to-slate-900 text-white',
      cardBg: 'bg-slate-900/90 border-slate-800 text-white backdrop-blur-xl',
      inputBg: 'bg-slate-950 border-slate-800 text-white placeholder-slate-500',
      buttonGradient: 'from-indigo-500 via-purple-600 to-pink-600 shadow-indigo-500/20',
      labelIdentifier: 'Email Mitra / No. WhatsApp Pemilik:',
      placeholderIdentifier: 'contoh: 089650846031 atau kurnia@laundryku.id',
      defaultHint: 'No. WA Demo: 089650846031 | PIN: 1234'
    },
    web: {
      title: 'Terminal Staf Kasir POS',
      subtitle: 'Akses transaksi kasir cepat, cetak struk thermal, dan label pakaian anti-air.',
      badge: 'SMARTKASIR POS TERMINAL',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-400/30',
      icon: '💻',
      themeBg: 'from-slate-900 via-sky-950 to-slate-950 text-white',
      cardBg: 'bg-slate-900/90 border-slate-800 text-white backdrop-blur-xl',
      inputBg: 'bg-slate-950 border-slate-800 text-white placeholder-slate-500',
      buttonGradient: 'from-sky-400 via-primary to-indigo-600 shadow-sky-500/20',
      labelIdentifier: 'ID Kasir / No. HP Staf:',
      placeholderIdentifier: 'contoh: 089650846031 atau kasir@toko.com',
      defaultHint: 'ID Kasir Demo: 089650846031 | PIN: 1234'
    },
    courier_app: {
      title: 'Portal Driver & Kurir Lapangan',
      subtitle: 'Buka rute penjemputan GPS, upload foto audit cucian, dan kirim update ke konsumen.',
      badge: 'SMARTKURIR RADAR LOGISTICS',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
      icon: '🛵',
      themeBg: 'from-slate-950 via-amber-950/40 to-slate-900 text-white',
      cardBg: 'bg-slate-900/90 border-slate-800 text-white backdrop-blur-xl',
      inputBg: 'bg-slate-950 border-slate-800 text-white placeholder-slate-500',
      buttonGradient: 'from-amber-500 via-orange-600 to-rose-600 shadow-amber-500/20',
      labelIdentifier: 'No. WhatsApp Driver / ID Kurir:',
      placeholderIdentifier: 'contoh: 081399881122',
      defaultHint: 'No. HP Demo: 081399881122 | PIN: 1234'
    }
  };

  const currentTheme = roleThemes[roleKey] || roleThemes.owner_mobile;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier.trim()) {
      setErrorMsg('Silakan masukkan Email atau No. WhatsApp Anda.');
      return;
    }

    if (!password || password.length < 4) {
      setErrorMsg('Password / PIN minimal 4 karakter (PIN Demo: 1234).');
      return;
    }

    setIsLoading(true);

    const inputClean = identifier.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

    // Super Admin Master Detection
    if (roleKey === 'super_admin' || inputClean.includes('admin') || inputClean === '081234567890') {
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess('super_admin', 'TNT-001');
      }, 400);
      return;
    }

    // Match Partner Tenant
    const matchedTenant = tenants.find(t => {
      const phoneClean = (t.ownerPhone || '').replace(/[^0-9]/g, '');
      const nameClean = (t.ownerName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const businessClean = (t.businessName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const idClean = (t.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');

      return (
        (phoneClean && (inputClean.includes(phoneClean) || phoneClean.includes(inputClean))) ||
        (nameClean && inputClean.includes(nameClean)) ||
        (businessClean && inputClean.includes(businessClean)) ||
        (idClean && inputClean === idClean)
      );
    }) || tenants[0];

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(roleKey, matchedTenant?.id || 'TNT-001');
    }, 400);
  };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${currentTheme.themeBg} flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden select-none font-sans`}>
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>

      {/* Top Navbar Header */}
      <header className="max-w-6xl w-full mx-auto flex justify-between items-center z-10">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs backdrop-blur-md transition-all shadow-sm group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Kembali ke Beranda Utama</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 via-primary to-indigo-600 flex items-center justify-center text-base shadow-sm">
            🧼
          </div>
          <span className="text-sm font-black text-white tracking-tight hidden sm:inline">LaundryKu Pro</span>
        </div>
      </header>

      {/* Center Login Box */}
      <main className="max-w-md w-full mx-auto my-auto z-10 py-6">
        <div className={`w-full rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border ${currentTheme.cardBg} animate-scale-up`}>
          {/* Role Header Banner */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center text-3xl shadow-clay-sm bg-gradient-to-tr from-slate-800 to-slate-700 border border-white/10">
              {currentTheme.icon}
            </div>
            <div>
              <span className={`inline-block px-3 py-1 rounded-full border text-[10px] font-black tracking-wider uppercase mb-1.5 ${currentTheme.badgeColor}`}>
                {currentTheme.badge}
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">{currentTheme.title}</h2>
              <p className="text-xs text-slate-400 font-semibold mt-1 leading-relaxed max-w-sm mx-auto">
                {currentTheme.subtitle}
              </p>
            </div>
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span>{currentTheme.labelIdentifier}</span>
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => { setIdentifier(e.target.value); setErrorMsg(''); }}
                placeholder={currentTheme.placeholderIdentifier}
                className={`w-full text-xs font-bold border rounded-2xl px-4 py-3.5 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 ${currentTheme.inputBg}`}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-primary" />
                  <span>Password / PIN Akses:</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                  placeholder="••••••••"
                  className={`w-full text-xs font-bold tracking-widest border rounded-2xl px-4 py-3.5 pr-11 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 ${currentTheme.inputBg}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Banner */}
            {errorMsg && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-2xl text-xs font-black text-rose-400 text-center animate-shake">
                {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 bg-gradient-to-r ${currentTheme.buttonGradient} hover:opacity-95 text-white rounded-2xl font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer disabled:opacity-50`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                  <span>Memverifikasi Akun...</span>
                </span>
              ) : (
                <>
                  <span>Masuk ke Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fill Hint */}
          <div className="pt-3 border-t border-white/10 text-center space-y-2">
            <p className="text-[10px] text-slate-400 font-semibold">
              💡 {currentTheme.defaultHint}
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center z-10">
        <p className="text-[11px] text-slate-400 font-semibold flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sistem Keamanan Terenkripsi Multi-Tenant SSL 256-bit • LaundryKu Pro</span>
        </p>
      </footer>
    </div>
  );
}
