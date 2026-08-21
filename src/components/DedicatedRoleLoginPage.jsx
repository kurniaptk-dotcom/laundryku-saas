import React, { useState } from 'react';
import { 
  Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, Sparkles, 
  Crown, Monitor, Truck, Smartphone, ChevronLeft, CheckCircle2
} from 'lucide-react';
import { DEFAULT_TENANTS } from '../utils/saasHelper';

export default function DedicatedRoleLoginPage({ 
  roleKey = 'owner_mobile', 
  tenants = DEFAULT_TENANTS, 
  customers = [],
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
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
      icon: '⚙️',
      iconBg: 'bg-gradient-to-tr from-slate-900 via-blue-950 to-indigo-900 text-amber-300 shadow-slate-900/30',
      buttonGradient: 'from-slate-900 via-blue-900 to-indigo-900 shadow-slate-900/25',
      labelIdentifier: 'ID Master / Email Super Admin:',
      placeholderIdentifier: 'admin@laundryku.id atau 081234567890',
      defaultHint: 'ID Demo: admin@laundryku.id | PIN: 1234'
    },
    owner_mobile: {
      title: 'Portal Pemilik Laundry (Owner)',
      subtitle: 'Pantau omzet harian, laporan laba rugi, dan kelola IoT mesin cuci gerai Anda.',
      badge: 'SMARTOWNER ERP PORTAL',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: '👑',
      iconBg: 'bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-400 text-white shadow-indigo-500/30',
      buttonGradient: 'from-indigo-600 via-blue-600 to-sky-500 shadow-indigo-500/25',
      labelIdentifier: 'Email Mitra / No. WhatsApp Pemilik:',
      placeholderIdentifier: 'contoh: 089650846031 atau kurnia@laundryku.id',
      defaultHint: 'No. WA Demo: 089650846031 | PIN: 1234'
    },
    web: {
      title: 'Terminal Staf Kasir POS',
      subtitle: 'Akses transaksi kasir cepat, cetak struk thermal, dan label pakaian anti-air.',
      badge: 'SMARTKASIR POS TERMINAL',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: '💻',
      iconBg: 'bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 text-white shadow-sky-500/30',
      buttonGradient: 'from-sky-500 via-blue-600 to-indigo-600 shadow-sky-500/25',
      labelIdentifier: 'ID Kasir / No. HP Staf:',
      placeholderIdentifier: 'contoh: 089650846031 atau kasir@toko.com',
      defaultHint: 'ID Kasir Demo: 089650846031 | PIN: 1234'
    },
    courier_app: {
      title: 'Portal Driver & Kurir Lapangan',
      subtitle: 'Buka rute penjemputan GPS, upload foto audit cucian, dan kirim update ke konsumen.',
      badge: 'SMARTKURIR RADAR LOGISTICS',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: '🛵',
      iconBg: 'bg-gradient-to-tr from-amber-500 via-orange-500 to-blue-600 text-white shadow-amber-500/30',
      buttonGradient: 'from-amber-500 via-orange-500 to-blue-600 shadow-amber-500/25',
      labelIdentifier: 'No. WhatsApp Driver / ID Kurir:',
      placeholderIdentifier: 'contoh: 081399881122',
      defaultHint: 'No. HP Demo: 081399881122 | PIN: 1234'
    },
    mobile: {
      title: 'Portal Pelanggan & Lacak Cucian',
      subtitle: 'Masukkan No. WhatsApp Anda untuk melacak status cucian, saldo laundry wallet, dan poin member.',
      badge: 'PORTAL KONSUMEN & TRACKING',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: '📱',
      iconBg: 'bg-gradient-to-tr from-teal-400 via-emerald-500 to-sky-500 text-white shadow-teal-500/30',
      buttonGradient: 'from-teal-500 via-emerald-600 to-sky-600 shadow-teal-500/25',
      labelIdentifier: 'No. WhatsApp / Email Pelanggan:',
      placeholderIdentifier: 'contoh: 0812-3456-7890 atau aisyah@laundrymail.com',
      defaultHint: 'No. WA Demo: 0812-3456-7890 | PIN: 1234'
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

    // Customer Portal Login Detection
    if (roleKey === 'mobile') {
      const matchedCustomer = (customers || []).find(c => {
        const phoneClean = (c.phone || '').replace(/[^0-9]/g, '');
        const emailClean = (c.email || '').toLowerCase();
        return (phoneClean && inputClean.includes(phoneClean)) || (emailClean && inputClean.includes(emailClean));
      });

      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess('mobile', 'TNT-001', matchedCustomer?.id || 'CUST-001');
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
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-100/80 via-white to-blue-50/70 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden select-none font-sans text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* Dynamic Ambient Glass Glow Orbs */}
      <div className="absolute top-[-10%] left-[15%] w-[450px] h-[450px] bg-gradient-to-br from-sky-400/25 to-blue-600/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[15%] w-[500px] h-[500px] bg-gradient-to-tr from-blue-400/20 via-indigo-400/20 to-sky-300/25 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>

      {/* Top Navbar Header */}
      <header className="max-w-6xl w-full mx-auto flex justify-between items-center z-10">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 border border-white/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-extrabold text-xs backdrop-blur-xl shadow-clay-sm transition-all group cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-primary" />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="flex items-center gap-2.5 bg-white/70 dark:bg-slate-900/70 border border-white/80 dark:border-slate-800 px-3.5 py-1.5 rounded-2xl backdrop-blur-xl shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 via-primary to-indigo-600 flex items-center justify-center text-white text-base shadow-sm">
            🧼
          </div>
          <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white">LaundryKu Pro</span>
        </div>
      </header>

      {/* Center Modern Clean Glassmorphism Login Card */}
      <main className="max-w-md w-full mx-auto my-auto z-10 py-6">
        <div className="w-full rounded-3xl p-6 sm:p-8 space-y-6 bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border border-white/90 dark:border-slate-800/80 shadow-2xl shadow-sky-500/10 dark:shadow-black/50 animate-scale-up">
          
          {/* Header Banner */}
          <div className="text-center space-y-3">
            <div className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center text-3xl shadow-clay-sm ${currentTheme.iconBg} border-2 border-white/80 dark:border-slate-700/50`}>
              {currentTheme.icon}
            </div>
            <div>
              <span className={`inline-block px-3 py-1 rounded-full border text-[10px] font-black tracking-wider uppercase mb-1.5 ${currentTheme.badgeColor}`}>
                {currentTheme.badge}
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {currentTheme.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1 leading-relaxed max-w-sm mx-auto">
                {currentTheme.subtitle}
              </p>
            </div>
          </div>

          {/* Clean Glassmorphic Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span>{currentTheme.labelIdentifier}</span>
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => { setIdentifier(e.target.value); setErrorMsg(''); }}
                placeholder={currentTheme.placeholderIdentifier}
                className="w-full text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-2xl px-4 py-3.5 transition-all focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/15 shadow-xs"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
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
                  className="w-full text-xs font-bold tracking-widest border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 text-slate-900 dark:text-white placeholder-slate-400 rounded-2xl px-4 py-3.5 pr-11 transition-all focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/15 shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs font-black text-rose-600 dark:text-rose-400 text-center animate-shake">
                {errorMsg}
              </div>
            )}

            {/* Vibrant Modern Blue Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 bg-gradient-to-r ${currentTheme.buttonGradient} hover:opacity-95 text-white rounded-2xl font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]`}
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
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center space-y-1.5">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center justify-center gap-1">
              <span>💡</span>
              <span>{currentTheme.defaultHint}</span>
            </p>
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center z-10">
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Sistem Keamanan Terenkripsi Multi-Tenant SSL 256-bit • LaundryKu Pro</span>
        </p>
      </footer>
    </div>
  );
}
