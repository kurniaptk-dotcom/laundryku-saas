import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, Sparkles, ArrowRight, X, UserCheck } from 'lucide-react';

export default function RoleLoginModal({ roleKey, onAuthenticate, onCancel, isDark = false }) {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const roleConfigs = {
    super_admin: {
      title: 'Kunci Akses Super Admin Master',
      subtitle: 'Masukkan PIN Kunci Master untuk mengelola platform SaaS.',
      icon: '⚙️',
      defaultPin: '1234',
      badge: 'MASTER SAAS CONTROL',
      color: 'bg-slate-900 border-slate-700 text-white'
    },
    web: {
      title: 'Login Staf Kasir POS',
      subtitle: 'Masukkan PIN Staf Kasir Toko untuk akses POS & Cetak Nota.',
      icon: '💻',
      defaultPin: '1234',
      badge: 'SMARTKASIR POS',
      color: 'bg-sky-600 border-sky-500 text-white'
    },
    owner_mobile: {
      title: 'Login Pemilik Laundry (Owner)',
      subtitle: 'Masukkan PIN Pemilik untuk melihat laporan omzet & IoT.',
      icon: '👑',
      defaultPin: '1234',
      badge: 'SMARTOWNER ERP',
      color: 'bg-indigo-600 border-indigo-500 text-white'
    },
    courier_app: {
      title: 'Login Kurir Lapangan',
      subtitle: 'Masukkan PIN Driver Kurir untuk lacak rute GPS & foto audit.',
      icon: '🛵',
      defaultPin: '1234',
      badge: 'SMARTKURIR RADAR',
      color: 'bg-amber-600 border-amber-500 text-white'
    }
  };

  const config = roleConfigs[roleKey] || roleConfigs.super_admin;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === config.defaultPin || pin === '1234') {
      onAuthenticate(roleKey);
    } else {
      setErrorMsg('PIN Salah! (Gunakan PIN Demo Default: 1234)');
    }
  };

  const handleQuickDemoLogin = () => {
    onAuthenticate(roleKey);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className={`w-full max-w-md rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border animate-scale-up ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-clay-sm ${config.color}`}>
              {config.icon}
            </div>
            <div>
              <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 text-[10px] font-black rounded-full uppercase">
                {config.badge}
              </span>
              <h3 className="text-lg font-black mt-0.5">{config.title}</h3>
            </div>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <p className="text-xs font-semibold text-slate-500 leading-relaxed">
          {config.subtitle}
        </p>

        {/* PIN Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Masukkan PIN 4 Digit:</span>
              <span className="text-[10px] text-slate-400">PIN Demo: <strong className="text-primary font-black">1234</strong></span>
            </label>
            <div className="relative">
              <input
                type="password"
                maxLength={4}
                required
                value={pin}
                onChange={(e) => { setPin(e.target.value); setErrorMsg(''); }}
                placeholder="••••"
                className={`w-full tracking-widest text-center text-xl font-black border rounded-2xl px-4 py-3 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900 shadow-inner'
                }`}
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
            </div>
            {errorMsg && (
              <p className="text-xs font-black text-rose-500 text-center animate-shake">{errorMsg}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-sky-400 via-primary to-indigo-600 hover:opacity-95 text-white rounded-2xl font-black text-xs shadow-clay-sm flex items-center justify-center gap-2"
          >
            <span>Verifikasi & Masuk Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Bypass */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 rounded-xl border border-dashed border-primary/40 bg-sky-50/50 dark:bg-sky-950/20 text-primary hover:bg-sky-100 font-black text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span>⚡ Masuk Cepat Mode Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
