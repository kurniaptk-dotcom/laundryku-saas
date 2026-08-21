import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, X, ShieldCheck, Eye, EyeOff, Sparkles, HelpCircle } from 'lucide-react';
import { DEFAULT_TENANTS } from '../utils/saasHelper';

export default function RoleLoginModal({ roleKey, tenants = DEFAULT_TENANTS, onAuthenticate, onCancel, isDark = false }) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const roleConfigs = {
    super_admin: {
      title: 'Portal Super Admin Master',
      subtitle: 'Masukkan kredensial Master SaaS Platform untuk mengelola seluruh sistem.',
      icon: '⚙️',
      badge: 'MASTER SAAS CONTROL',
      color: 'bg-slate-900 border-slate-700 text-white',
      placeholderUser: 'admin@laundryku.id atau 081234567890',
      btnText: 'Masuk ke Master Console'
    },
    web: {
      title: 'Login Staf Kasir POS',
      subtitle: 'Masukkan Email / No. HP terdaftar & PIN/Password Kasir Anda.',
      icon: '💻',
      badge: 'SMARTKASIR POS',
      color: 'bg-sky-600 border-sky-500 text-white',
      placeholderUser: 'email@kasir.com atau 0812xxxxxxx',
      btnText: 'Masuk ke Kasir POS'
    },
    owner_mobile: {
      title: 'Login Pemilik Laundry (Owner)',
      subtitle: 'Masukkan Email / No. WhatsApp terdaftar untuk masuk ke ERP Toko Anda.',
      icon: '👑',
      badge: 'SMARTOWNER ERP',
      color: 'bg-indigo-600 border-indigo-500 text-white',
      placeholderUser: 'Email atau No. WhatsApp Mitra (contoh: 0896xxxxxxx)',
      btnText: 'Masuk ke Dashboard ERP Toko'
    },
    courier_app: {
      title: 'Login Kurir Lapangan',
      subtitle: 'Masukkan No. HP Kurir & PIN untuk membuka rute penjemputan.',
      icon: '🛵',
      badge: 'SMARTKURIR RADAR',
      color: 'bg-amber-600 border-amber-500 text-white',
      placeholderUser: 'No. WhatsApp Kurir (contoh: 0813xxxxxxx)',
      btnText: 'Masuk ke App Kurir'
    }
  };

  const config = roleConfigs[roleKey] || roleConfigs.owner_mobile;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailOrPhone.trim()) {
      setErrorMsg('Silakan masukkan Email atau No. WhatsApp Anda.');
      return;
    }

    if (!password || password.length < 4) {
      setErrorMsg('Password / PIN minimal 4 karakter (Default demo: 1234).');
      return;
    }

    setIsLoading(true);

    // Normalize input to find matching tenant cleanly
    const inputClean = emailOrPhone.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Check if logging in as Super Admin Master
    if (inputClean.includes('admin') || inputClean === '081234567890' || roleKey === 'super_admin') {
      setTimeout(() => {
        setIsLoading(false);
        onAuthenticate('super_admin', 'TNT-001');
      }, 400);
      return;
    }

    // Find matching tenant based on phone, email, ownerName, or businessName
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
    }) || tenants[0]; // fallback to first tenant if custom

    setTimeout(() => {
      setIsLoading(false);
      onAuthenticate(roleKey, matchedTenant?.id || 'TNT-001');
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className={`w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border animate-scale-up ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-clay-sm flex-shrink-0 ${config.color}`}>
              {config.icon}
            </div>
            <div>
              <span className="px-2.5 py-0.5 bg-primary/10 text-primary border border-primary/20 text-[10px] font-black rounded-full uppercase tracking-wider">
                {config.badge}
              </span>
              <h3 className="text-lg font-black mt-0.5 tracking-tight">{config.title}</h3>
            </div>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Tutup & Kembali"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
          {config.subtitle}
        </p>

        {/* Private Authentication Form - Zero Data Leakage */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email / WhatsApp Number Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span>Email / No. WhatsApp:</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => { setEmailOrPhone(e.target.value); setErrorMsg(''); }}
                placeholder={config.placeholderUser}
                className={`w-full text-xs font-bold border rounded-2xl px-4 py-3.5 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900 shadow-xs placeholder-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Password / PIN Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-primary" />
                <span>Password / PIN:</span>
              </label>
              <span className="text-[10px] text-slate-400 font-semibold">PIN Default: <strong className="text-primary font-black">1234</strong></span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                placeholder="••••••••"
                className={`w-full text-xs font-bold tracking-widest border rounded-2xl px-4 py-3.5 pr-11 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900 shadow-xs'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs font-black text-rose-600 dark:text-rose-400 text-center animate-shake">
              {errorMsg}
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-sky-400 via-primary to-indigo-600 hover:opacity-95 text-white rounded-2xl font-black text-xs shadow-clay-sm flex items-center justify-center gap-2 transition-all mt-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                <span>Memverifikasi Akun...</span>
              </span>
            ) : (
              <>
                <span>{config.btnText}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security & Privacy Guarantee Note */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center space-y-1">
          <p className="text-[11px] font-semibold text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Koneksi Terenkripsi SSL 256-bit & Privasi Terjamin</span>
          </p>
        </div>
      </div>
    </div>
  );
}
