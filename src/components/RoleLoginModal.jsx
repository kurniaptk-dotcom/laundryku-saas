import React, { useState } from 'react';
import { Lock, Mail, Building2, KeyRound, Sparkles, ArrowRight, X, UserCheck, ShieldCheck } from 'lucide-react';
import { DEFAULT_TENANTS } from '../utils/saasHelper';

export default function RoleLoginModal({ roleKey, tenants = DEFAULT_TENANTS, onAuthenticate, onCancel, isDark = false }) {
  const [selectedTenantId, setSelectedTenantId] = useState(tenants[0]?.id || 'TNT-001');
  const [emailOrPhone, setEmailOrPhone] = useState(tenants[0]?.ownerPhone || '0812-3456-7890');
  const [passwordOrPin, setPasswordOrPin] = useState('1234');
  const [errorMsg, setErrorMsg] = useState('');

  const roleConfigs = {
    super_admin: {
      title: 'Login Super Admin Master',
      subtitle: 'Masukkan Kunci Akses Master SaaS Platform.',
      icon: '⚙️',
      badge: 'MASTER SAAS CONTROL',
      color: 'bg-slate-900 border-slate-700 text-white'
    },
    web: {
      title: 'Login Staf Kasir POS',
      subtitle: 'Pilih gerai toko & masukkan PIN/Password Kasir.',
      icon: '💻',
      badge: 'SMARTKASIR POS',
      color: 'bg-sky-600 border-sky-500 text-white'
    },
    owner_mobile: {
      title: 'Login Pemilik Laundry (Owner)',
      subtitle: 'Masukkan Email/No. HP Mitra & Password untuk akses ERP Toko Anda.',
      icon: '👑',
      badge: 'SMARTOWNER ERP',
      color: 'bg-indigo-600 border-indigo-500 text-white'
    },
    courier_app: {
      title: 'Login Kurir Lapangan',
      subtitle: 'Pilih toko & masukkan PIN Kurir Driver.',
      icon: '🛵',
      badge: 'SMARTKURIR RADAR',
      color: 'bg-amber-600 border-amber-500 text-white'
    }
  };

  const config = roleConfigs[roleKey] || roleConfigs.super_admin;
  const activeTenant = tenants.find(t => t.id === selectedTenantId) || tenants[0];

  const handleSelectTenantChange = (tenantId) => {
    setSelectedTenantId(tenantId);
    const tenant = tenants.find(t => t.id === tenantId);
    if (tenant) {
      setEmailOrPhone(tenant.ownerPhone || tenant.ownerName);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordOrPin === '1234' || passwordOrPin.length >= 4) {
      onAuthenticate(roleKey, selectedTenantId);
    } else {
      setErrorMsg('Password / PIN minimal 4 Karakter! (PIN Demo: 1234)');
    }
  };

  const handleQuickDemoLogin = (tenantId) => {
    const targetId = tenantId || selectedTenantId;
    onAuthenticate(roleKey, targetId);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border animate-scale-up ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-3">
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
              className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <p className="text-xs font-semibold text-slate-500 leading-relaxed">
          {config.subtitle}
        </p>

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tenant Store Selection */}
          {roleKey !== 'super_admin' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-primary" />
                <span>Pilih Gerai Toko Laundry Mitra:</span>
              </label>
              <select
                value={selectedTenantId}
                onChange={(e) => handleSelectTenantChange(e.target.value)}
                className={`w-full text-xs font-black border rounded-2xl px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 shadow-xs'
                }`}
              >
                {tenants.map(t => (
                  <option key={t.id} value={t.id}>
                    🏬 {t.businessName} ({t.ownerName} - {t.city || 'Indonesia'})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Email / Phone Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-primary" />
              <span>Email Mitra / No. WhatsApp:</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="contoh: 0819-9988-7766 atau owner@laundry.com"
                className={`w-full text-xs font-bold border rounded-2xl px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 shadow-xs'
                }`}
              />
            </div>
          </div>

          {/* Password / PIN Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-primary" />
                <span>Password / PIN Akses Toko:</span>
              </span>
              <span className="text-[10px] text-slate-400">PIN Demo: <strong className="text-primary font-black">1234</strong></span>
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={passwordOrPin}
                onChange={(e) => { setPasswordOrPin(e.target.value); setErrorMsg(''); }}
                placeholder="••••••••"
                className={`w-full text-xs font-bold tracking-widest border rounded-2xl px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 shadow-xs'
                }`}
              />
            </div>
            {errorMsg && (
              <p className="text-xs font-black text-rose-500 text-center animate-shake">{errorMsg}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-sky-400 via-primary to-indigo-600 hover:opacity-95 text-white rounded-2xl font-black text-xs shadow-clay-sm flex items-center justify-center gap-2 transition-all mt-2"
          >
            <span>Login Ke {activeTenant ? activeTenant.businessName : 'Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Accounts Picker */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">⚡ Pilihan Cepat Demo Akun Mitra Laundry:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {tenants.slice(0, 4).map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleQuickDemoLogin(t.id)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-sky-50 dark:bg-slate-950 text-left transition-all hover:border-sky-300 group"
              >
                <p className="text-xs font-black text-slate-850 dark:text-white group-hover:text-primary truncate">🏬 {t.businessName}</p>
                <p className="text-[10px] text-slate-400 font-semibold truncate">👤 {t.ownerName} ({t.ownerPhone})</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
